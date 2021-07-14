const Record = require('../models/records')
const excel = require('exceljs')

async function download (id) {
  const records = await Record.find({
    userId: id,
    isDelete: false
  })
    .sort({ date: 'desc' })
    .lean()

  const toDownload = []
  records.forEach(record => {
    toDownload.push({
      name: record.name,
      category: record.category,
      date: record.date,
      amount: record.amount,
      merchant: record.merchant
    })
  })

  const workbook = new excel.Workbook()
  const worksheet = workbook.addWorksheet('Records')

  worksheet.columns = [
    { header: '項目名稱', key: 'name' },
    { header: '類別', key: 'category' },
    { header: '日期', key: 'date' },
    { header: '金額', key: 'amount' },
    { header: '商家', key: 'merchant' }
  ]
  worksheet.addRows(toDownload)

  const timeStart = new Date()
  const date = timeStart.toISOString().slice(0, 10).split('-').join('')
  const time = timeStart.toLocaleTimeString('en-US', { timeStyle: 'medium', hour12: false }).split(':').join('') // HH:MM:SS to HHMMSS
  const fileName = `records_${date}_${time}.txt`

  return { workbook, fileName }
}

module.exports = { download }
