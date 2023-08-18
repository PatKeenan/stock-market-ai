import express from 'express'

import { usersController } from '@/controllers/users-controller'

const usersRouter = express.Router()

usersRouter.get('/:id', usersController.getOne)
usersRouter.get('/', usersController.getAll)
usersRouter.post('/', usersController.create)
usersRouter.put('/:id', usersController.update)

export { usersRouter }
