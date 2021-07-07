const { view } = require('./view')
const { controller } = require('./controller')
const { elementObjects } = require('./elementObjects')

const { renderChart } = require('./chart')

elementObjects.filterConditions.addEventListener('change', async (event) => {
  const month = elementObjects.month.value
  const category = elementObjects.category.value

  const condition = {}
  if (month) condition.date = month
  if (category) condition.category = category

  const response = await controller.getFilterResults(condition)
  view.displayResult(response.data)

  // for chart
  if (month && !category) {
    renderChart(month)
  } else {
    // hide chart when user select specific category
    elementObjects.chartContainer.innerHTML = ''
  }
})
