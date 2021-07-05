const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String,
    trim: true
  },
  avatar: {
    data: Buffer,
    contentType: String
  },
  type: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', userSchema)
