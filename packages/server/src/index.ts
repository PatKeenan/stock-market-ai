import express from 'express'
import bodyParser from 'body-parser'

import { api } from './api'

const server = express()

server.use(bodyParser.json())
server.use(`/api/v1`, api)

server.listen(3001, () => {
    console.log('Server is running on port 3001')
})
