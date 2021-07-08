const axios = require('axios')
const Chart = require('chart.js')
const { elementObjects } = require('./elementObjects')

async function renderChart (month = new Date().toISOString().slice(0, 7)) {
  // reset canvas for new chart
  elementObjects.chartContainer.innerHTML = '<canvas id="chart"></canvas>'

  const response = await axios.post('/', { month })
  if (!response.data.length) return

  const labels = []
  response.data.forEach(item => (labels.push(item._id)))
  const data = []
  response.data.forEach(item => (data.push(item.amount)))

  const chart = document.querySelector('#chart').getContext('2d')
  const myChart = new Chart(chart, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '開銷金額',
        data,
        backgroundColor: [
          'rgba(26, 26, 26, 0.2)',
          'rgba(240, 173, 78, 0.2)'
        ],
        borderColor: [
          'rgba(26, 26, 26, 1)',
          'rgba(240, 173, 78, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

renderChart()

module.exports = { renderChart }
