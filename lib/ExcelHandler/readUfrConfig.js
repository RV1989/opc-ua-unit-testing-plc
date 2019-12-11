//@ts-check
const readWorkBook = require('./readWorkBook').readWorkBook
const getMaxRows = require('./getMaxRows').getMaxRows
const XLSX = require('xlsx')

const readUfrConfig = async (workbookPath) => {
    let sheet = 'Drives'
    let workbook = await readWorkBook(workbookPath)
    let maxRow = getMaxRows(workbook, sheet)
    let readOptions = {}
    readOptions.range = 'A2-ZZ' + maxRow
    readOptions.header = [
      'ipAddress',
      'pnName',
      'gsd',
      'ufr',
      'slot',
      'startAddress',
    ]
    return (XLSX.utils.sheet_to_json(workbook.Sheets[sheet], readOptions))
  }

  module.exports = {readUfrConfig}