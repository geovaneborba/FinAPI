import express from 'express'

const app = express()

app.use(express.json())

app.get('/', (request, response) => response.json({ message: 'Test'}))

app.listen(3001, () => console.log('🚀 Back-end started on port 3000 🔥'))