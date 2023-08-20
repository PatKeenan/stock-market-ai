import { z } from 'zod'

const userSchema = z.object({
    id: z.number().positive(),
    email: z.string().email({ message: 'Invalid email' }),
    password: z
        .string()
        .min(8, 'Password must be greater than 8 characters.')
        .max(100, 'Password must be less than 100 characters.')
})
const userCreateSchema = userSchema.omit({ id: true })
const userUpdateSchema = userSchema
const userGetOneSchema = userSchema.pick({ id: true })

export { userSchema, userCreateSchema, userUpdateSchema, userGetOneSchema }
