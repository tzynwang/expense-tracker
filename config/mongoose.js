const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', (error) => {
  console.log('mongodb error', error)
})
db.once('open', () => {
  console.log('mongodb connect')
})

module.exports = db
