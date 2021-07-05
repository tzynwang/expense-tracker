const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId
  },
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
  },
  isDelete: {
    type: Boolean,
    default: false,
    required: true
  }
})

module.exports = mongoose.model('Record', recordSchema)
