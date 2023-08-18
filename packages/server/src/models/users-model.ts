import { db } from '@/utils/db-client'

type UserType = {
    id: number
    email: string
    password: string
}

export const UsersModel = {
    async getOne(id: number) {
        const data = await db.query(`SELECT * FROM users WHERE id = $1`, [id])
        return { data: data.rows }
    },
    async getAll() {
        const data = await db.query(`SELECT * FROM users`)
        return { data: data.rows }
    },
    async create(user: Omit<UserType, 'id'>) {
        // TODO: Validate Input
        const data = await db.query(
            `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`,
            [user.email, user.password]
        )
        return { data: data.rows }
    },
    async update(id: number, user: Partial<UserType>) {
        const data = await db.query(
            `UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *`,
            [user.email, user.password, id]
        )
        return { data: data.rows }
    },
    async delete(id: number) {
        const data = await db.query(`DELETE FROM users WHERE id = $1`, [id])
        return { data: data.rows }
    }
}
