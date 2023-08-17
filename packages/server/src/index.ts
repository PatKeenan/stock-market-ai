import express from 'express'
import router from './models/root'

import { db } from './utils/db-client'

const app = express()

app.use('/api/v1', router)

app.get('/', async (req, res) => {
    const data = await db.query('SELECT * FROM users')
})

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})
