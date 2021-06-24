const Records = require('../records')
const db = require('../../config/mongoose')

const sampleRecords = require('./sampleRecords.json')

db.once('open', async () => {
  console.log('mongodb connect records')
  for (const record of sampleRecords) {
    await Records.create({
      name: record.name,
      category: record.category,
      date: new Date().toISOString().slice(0, 10), // the date that runs seeds scripts
      amount: record.amount
    })
  }
  console.log('Generate records by seeder DONE')
  db.close()
})
