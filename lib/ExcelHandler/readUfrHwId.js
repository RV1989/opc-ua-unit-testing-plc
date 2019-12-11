//@ts-check
const readWorkBook = require('./readWorkBook').readWorkBook
const getMaxRows = require('./getMaxRows').getMaxRows
const XLSX = require('xlsx')

const readUfrHwId = async (workbookPath) => {
    let sheet = 'HwId'
    let workbook = await readWorkBook(workbookPath)
    let maxRow = getMaxRows(workbook, sheet)
    let readOptions = {}
    readOptions.range = 'A2-ZZ' + maxRow
    readOptions.header = [
      'hwIdName',
      'type',
      'hwId'
        ]
    return (XLSX.utils.sheet_to_json(workbook.Sheets[sheet], readOptions))
  }

  module.exports = {readUfrHwId}