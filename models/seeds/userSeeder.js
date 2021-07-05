const User = require('../users')
const db = require('../../config/mongoose')
const sampleUsers = require('./sampleUsers')

// password hash
const bcrypt = require('bcrypt')
const saltRounds = 10

db.once('open', async () => {
  console.log('mongodb connected from userSeeder')
  for (const user of sampleUsers) {
    await User.create({
      username: user.firstName,
      email: user.email,
      password: await bcrypt.hash(user.password, saltRounds),
      type: 'local',
      avatar_url: `https://avatars.dicebear.com/api/jdenticon/${user.firstName}.svg?width=128&background=%23ffffff`
    })
  }
  console.log('mongodb userSeeder done')
  db.close()
})
