import express from 'express'
import { usersRouter } from '@/routers/users-router'

const api = express.Router()

api.use('/users', usersRouter)

export { api }
