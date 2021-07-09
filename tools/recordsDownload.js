const Record = require('../models/records')
const excel = require('exceljs')

async function download (req, res) {
  const records = await Record.find({
    userId: req.user._id,
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

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${fileName}.xlsx`
  )

  return workbook.xlsx.write(res).then(function () {
    res.status(200).end()
  })
}

module.exports = { download }
