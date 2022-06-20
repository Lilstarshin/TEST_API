// @ts-check

const express = require('express')
const { events } = require('./router')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(events)

// 상태 확인용
app.get('/', (req, res) => {
  res.send('Server is running!')
})

module.exports = app
