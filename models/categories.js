const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Category', categorySchema)
