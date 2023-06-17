const express = require('express')
const exphbs = require('express-handlebars')
const routes = require('./routes')
const app = express()
const PORT = process.env.PORT || 3000
app.engine('hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(routes)
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`)
})

module.exports = app
