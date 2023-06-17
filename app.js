const express = require('express')
const routes = require('./routes')
const app = express()
const PORT = process.env.PORT || 3000

app.use(routes)
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`)
})

module.exports = app
