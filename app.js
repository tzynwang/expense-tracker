const express = require('express')
const app = express()
const port = 3000

const expressHandlebars = require('express-handlebars')
const handlebarsHelpers = require('handlebars-helpers')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helpers = handlebarsHelpers()
const routes = require('./routes')

app.engine('handlebars', expressHandlebars({ helpers: helpers, defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(routes)

require('./config/mongoose')

app.listen(port, (error) => {
  error ? console.log('error', error) : console.log(`App is running on http://localhpst:${port}`)
})
