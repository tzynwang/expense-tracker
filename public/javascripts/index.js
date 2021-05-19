const elementObjects = {
  select: document.querySelector('#category'),
  listGroup: document.querySelector('.list-group'),
  modals: document.querySelector('.modals'),
  totalAmount: document.querySelector('p.h1')
}

const view = {
  displayResult (results) {
    elementObjects.listGroup.innerHTML = ''
    elementObjects.modals.innerHTML = ''
    let updateTotalAmount = 0
    results.forEach(result => {
      updateTotalAmount += result.amount
      elementObjects.listGroup.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>
          ${result.date}
          ${result.iconPair[0].icon}
          ${result.name}
        </span>
        <span>
          ${result.amount}元
          <a href="/expense/${result._id}" class="btn btn-primary">修改</a>
          <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#deleteModal${result._id}">刪除</button>
        </span>
      </li>
      `
      elementObjects.modals.innerHTML += `
      <div class="modal fade" id="deleteModal${result._id}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <p class="h5 modal-title">確認刪除</p>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              確認要刪除帳目「${result.name}」嗎？
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
              <form action="/expense/${result._id}?_method=DELETE" method="POST">
                <button type="submit" class="btn btn-primary">確認刪除</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      `
    })
    elementObjects.totalAmount.innerHTML = `統計金額：${updateTotalAmount}元`
  }
}

const controller = {
  getFilterResults (category) {
    axios.post('/filter', {
      category: category
    })
      .then(response => {
        console.log(response.data)
        view.displayResult(response.data)
      })
      .catch(error => console.log(error))
  }
}

elementObjects.select.addEventListener('change', (event) => {
  const category = event.target.value
  controller.getFilterResults(category)
})
