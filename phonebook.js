const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('Person', function getPerson (req) {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use((req,res,next) => {
    if (req.method === 'POST') {
        morgan(':method :url :status :res[content-length] - :response-time ms :Person')(req,res,next);
    } 
    else {
        morgan(':method :url :status :res[content-length] - :response-time ms')(req,res,next);
    }
})

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
    }
  ]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req,res) => {
    res.send(`Phonebook has info for ${persons.length} people. </br> ${Date()}`)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
})

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req,res) => {
    const body = req.body

    const checkName = (name) => persons.find(person => person.name === name)

    if (!body.name) {
        return res.status(400).json({ 
            error: 'Name is missing' 
        })
    }
    else if (!body.number) {
        return res.status(400).json({ 
            error: 'Number is missing' 
        })
    }
    else if (checkName(body.name)) {
        return res.status(400).json({ 
            error: 'Name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})