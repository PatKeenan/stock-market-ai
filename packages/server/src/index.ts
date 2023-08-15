import express from 'express'
import router from './models/root'

const app = express()

app.use('/api/v1', router)

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})
