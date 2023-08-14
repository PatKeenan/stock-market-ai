import express from 'express'

const app = express()
const port = 3001

// set the api routes to the express app
app.use('/api', (req, res) => {
    res.status(200).json({ message: 'Hello from the API' })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
