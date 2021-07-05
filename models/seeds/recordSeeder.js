const Record = require('../records')
const User = require('../users')
const db = require('../../config/mongoose')
const sampleUsers = require('./sampleUsers')
const sampleRecords = require('./sampleRecords.json')

db.once('open', async () => {
  console.log('mongodb connect from recordSeeder')

  for (const user of sampleUsers) {
    const targetUser = await User.findOne({ email: user.email }).lean()
    for (const record of sampleRecords) {
      await Record.create({
        name: record.name,
        category: record.category,
        date: new Date().toISOString().slice(0, 10), // the date that runs seeds scripts
        amount: record.amount,
        userId: targetUser._id
      })
    }
  }

  console.log('mongodb recordSeeder done')
  db.close()
})
