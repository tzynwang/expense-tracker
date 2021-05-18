const Categories = require('../categories')
const db = require('../../config/mongoose')

const categoryArray = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']

db.once('open', () => {
  console.log('mongodb connect')
  categoryArray.forEach(category => {
    Categories.create({
      name: category
    })
  })
  console.log('Generate categories by seeder DONE')
})
