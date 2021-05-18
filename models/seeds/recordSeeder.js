const Records = require('../records')
const db = require('../../config/mongoose')

const sampleRecords = require('../../sampleRecords.json')

db.once('open', () => {
  console.log('mongodb connect')
  sampleRecords.results.forEach(eachRecord => {
    Records.create({
      name: eachRecord.name,
      category: eachRecord.category,
      date: new Date().toISOString().slice(0, 10), // the date that runs seeds scripts
      amount: eachRecord.amount
    })
  })
  console.log('Generate records by seeder DONE')
})
