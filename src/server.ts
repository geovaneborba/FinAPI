import express from 'express'
import {} from 'uuid'

const app = express()

app.use(express.json())


/**
 * cpf - string
 * name - string
 * id - uuid
 * statment - []
 */

app.get('/post', (request, response) => {
  const { cpf, name } = request.body

  const id = uuid()
})

app.listen(3001, () => console.log('🚀 Back-end started on port 3000 🔥'))