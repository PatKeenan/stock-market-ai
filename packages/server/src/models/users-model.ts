import bcrypt from 'bcrypt'
import { db } from '@/lib/db-client'
import { redisProxy } from '@/lib/redis-client'

// Example of caching: DO NOT CACHE USER PASSWORDS IN PRODUCTION

export type UserType = {
    id: number
    email: string
    password: string
}

const UserCacheTTL = 60

export const UsersModel = {
    async getOne(id: number) {
        const cachedUser = await redisProxy.get(`user:${id}`)

        if (cachedUser) {
            return { data: JSON.parse(cachedUser) }
        }

        const data = await db.query(`SELECT * FROM users WHERE id = $1`, [id])
        await redisProxy.set(`user:${id}`, data.rows[0], 'EX', UserCacheTTL)

        return { data: data.rows[0] }
    },
    async getAll() {
        const cachedUsers = await redisProxy.get('users')

        if (cachedUsers) {
            return { data: JSON.parse(cachedUsers) }
        }

        const data = await db.query(`SELECT * FROM users`)
        await redisProxy.set('users', data.rows, 'EX', UserCacheTTL)

        return { data: data.rows }
    },
    async create(user: Omit<UserType, 'id'>) {
        // TODO: Validate Input
        const { email, password } = user

        const hashedPassword = await bcrypt.hash(password, 10)

        const data = await db.query(
            `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`,
            [email, hashedPassword]
        )

        const cachedUsers = await redisProxy.get('users')
        if (cachedUsers) {
            await redisProxy.set(
                'users',
                [...JSON.parse(cachedUsers), data.rows[0]],
                'EX',
                UserCacheTTL
            )
        } else {
            await redisProxy.set('users', data.rows, 'EX', UserCacheTTL)
        }

        return { data: data.rows }
    },
    async update(id: number, user: Partial<UserType>) {
        const data = await db.query(
            `UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *`,
            [user.email, user.password, id]
        )

        // TODO: Update cache for the user

        return { data: data.rows }
    },
    async delete(id: number) {
        const data = await db.query(`DELETE FROM users WHERE id = $1`, [id])

        if ((await redisProxy.get(`user:${id}`)) !== null) {
            await redisProxy.del(`user:${id}`)
        }

        return { data: data.rows }
    }
}
