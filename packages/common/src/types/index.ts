import { userSchema } from '@/shared/schemas/user-schema'
import { z } from 'zod'

export type UserType = z.infer<typeof userSchema>
export type UserCreateType = Omit<UserType, 'id'>
