const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Record', recordSchema)
