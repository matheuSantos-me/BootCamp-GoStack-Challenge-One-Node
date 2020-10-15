const express = require("express")
const cors = require("cors")
const { v4: uuid } = require('uuid')

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

app.get("/repositories", (req, res) => {
  if (repositories.length === 0)
    return res.status(404).json({ error: 'Repositories not found, to display register a new one!' })
  
  else
    return res.json(repositories)
})

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body

  const body = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(body)

  return res.status(200).json(body)
})

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params
  const { title, url, techs } = req.body

  const findIndex = repositories.findIndex(item => item.id === id)

  if (findIndex < 0)
    res.status(400).json({ error: 'Repository that does not exist!' })

  const likes = repositories[findIndex].likes
  
  const body = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[findIndex] = body

  return res.json(body)
})

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  const findIndex = repositories.findIndex(item => item.id === id)

  if (findIndex < 0)
    return res.status(400).json({ error: 'Repository that does not exist!' })
    
  else
    repositories.splice(findIndex, 1)
    return res.status(204).send()
})

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params

  const findIndex = repositories.findIndex(item => item.id === id)

  if (findIndex < 0)
    res.status(400).json({ error: 'Repository that does not exist!' })

  repositories[findIndex].likes += 1

  return res.json(repositories[findIndex])
})

module.exports = app