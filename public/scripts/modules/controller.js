const axios = require('axios')

const controller = {
  async getFilterResults (category) {
    return await axios.post('/filter', { category })
  }
}

module.exports = { controller }
