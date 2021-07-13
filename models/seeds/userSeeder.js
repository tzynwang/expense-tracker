const User = require('../users')
const db = require('../../config/mongoose')
const sampleUsers = require('./sampleUsers')

// password hash
const bcrypt = require('bcrypt')
const saltRounds = 10

// generate avatar
const { generateAvatar } = require('../../tools/generateAvatar')

db.once('open', async () => {
  console.log('mongodb connected from userSeeder')
  for (const user of sampleUsers) {
    await User.create({
      username: user.firstName,
      email: user.email,
      password: await bcrypt.hash(user.password, saltRounds),
      type: 'DEMO',
      avatar_url: generateAvatar(user.firstName)
    })
  }
  console.log('mongodb userSeeder done')
  db.close()
})
