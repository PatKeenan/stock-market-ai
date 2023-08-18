import express from 'express'

import { UsersModel } from '@/models/users-model'
import { http } from '@/utils/http'

export const usersController = {
    async getOne(req: express.Request, res: express.Response) {
        const { id } = req.params

        if (!id) {
            return res
                .status(http.badRequest)
                .json({ message: 'id is required' })
        }
        try {
            const user = await UsersModel.getOne(parseInt(id))
            return res.status(http.ok).json(user)
        } catch (error) {
            return res.status(http.serverError).json({ error })
        }
    },

    async getAll(req: express.Request, res: express.Response) {
        try {
            const users = await UsersModel.getAll()
            return res.status(http.ok).json(users)
        } catch (error) {
            return res.status(http.serverError).json({ error })
        }
    },

    async create(req: express.Request, res: express.Response) {
        const { email = undefined, password = undefined } = req?.body
        if (!email || !password) {
            return res
                .status(http.badRequest)
                .json({ message: 'email and password are required' })
        }

        try {
            const user = await UsersModel.create({ email, password })
            return res.status(http.created).json(user)
        } catch (error) {
            return res.status(http.serverError).json({ error })
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
