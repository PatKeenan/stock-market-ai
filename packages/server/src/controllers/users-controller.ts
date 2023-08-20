import express from 'express'

import { UsersModel } from '@/models/users-model'
import { http } from '@/utils/http'
import { logger } from '@/utils/logger'

import {
    userCreateSchema,
    userGetOneSchema
} from 'common/src/shared/schemas/user-schema'
import { ZodError } from 'zod'

export const usersController = {
    async getOne(req: express.Request, res: express.Response) {
        if (Number.isNaN(parseInt(req.params?.id || '', 10))) {
            return res.status(http.badRequest).json({
                error: 'id must be a number'
            })
        }
        try {
            const { id } = userGetOneSchema.parse({
                id: parseInt(req.params?.id, 10) || ''
            })
            const user = await UsersModel.getOne(id)
            return res.status(http.ok).json(user)
        } catch (error: any) {
            return res.status(http.serverError).json({
                error:
                    error?.detail ||
                    (error instanceof ZodError
                        ? error.issues.map((e) => e.message)
                        : 'Server Error')
            })
        }
    },

    async getAll(_req: express.Request, res: express.Response) {
        try {
            return res.status(http.ok).json(await UsersModel.getAll())
        } catch (error) {
            return res.status(http.serverError).json({ error })
        }
    },

    async create(req: express.Request, res: express.Response) {
        try {
            const { email, password } = userCreateSchema.parse(req.body)
            const user = await UsersModel.create({ email: email, password })
            return res.status(http.created).json(user)
        } catch (error: any) {
            logger.error(JSON.stringify(error))
            return res.status(http.serverError).json({
                error:
                    error?.detail ||
                    (error instanceof ZodError
                        ? error.issues.map((e) => e.message)
                        : 'Server Error')
            })
        }
    },

    async update(req: express.Request, res: express.Response) {
        const { id = undefined } = req?.params
        const { email = undefined, password = undefined } = req?.body

        if (!id) {
            return res
                .status(http.badRequest)
                .json({ message: 'id is required' })
        }

        if (!email && !password) {
            return res.status(http.badRequest).json({
                message: 'email or password is required'
            })
        }

        try {
            const user = await UsersModel.update(parseInt(id), {
                email,
                password
            })
            return res.status(http.ok).json(user)
        } catch (error) {
            return res.status(http.serverError).json({ error })
        }
    },

    async delete(req: express.Request, res: express.Response) {
        const { id } = req.params

        if (!id) {
            return res
                .status(http.badRequest)
                .json({ message: 'id is required' })
        }

        try {
            const user = await UsersModel.delete(parseInt(id))
            return res.status(http.ok).json(user)
        } catch (error) {
            return res.status(http.serverError).json({ error })
        }
    }
}
