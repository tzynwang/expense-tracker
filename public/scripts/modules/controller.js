const axios = require('axios')

const controller = {
  async getFilterResults (condition) {
    return await axios.post('/filter', { condition })
  }
}

module.exports = { controller }
