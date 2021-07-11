const mongoose = require('mongoose')
const Schema = mongoose.Schema
const sessionSchema = new Schema({
  session: {
    lastAccess: Date,
    cookie: {
      originalMaxAge: Date,
      expires: Date,
      httpOnly: Boolean,
      path: String
    },
    _csrf: String
  },
  expires: Date
})

module.exports = mongoose.model('Session', sessionSchema)
