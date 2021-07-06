const axios = require('axios')

const controller = {
  async getFilterResults (condition) {
    return await axios.post('/expense/filter', { condition })
  }
}

module.exports = { controller }
