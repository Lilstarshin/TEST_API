// @ts-check
const { log } = require('console')
const app = require('./app')

const PORT = 3000
app.listen(PORT, () => {
  log(`The Express server is listhening at port: ${PORT}`)
})
