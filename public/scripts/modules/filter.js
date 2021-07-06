const { view } = require('./view')
const { controller } = require('./controller')
const { elementObjects } = require('./elementObjects')

elementObjects.select.addEventListener('change', async (event) => {
  const category = event.target.value
  const response = await controller.getFilterResults(category)
  view.displayResult(response.data)
})
