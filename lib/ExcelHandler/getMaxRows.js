//@ts-check
const XLSX = require('xlsx')

const getMaxRows = (workbook, sheet) =>{
    return XLSX.utils.decode_range(workbook.Sheets[sheet]['!ref']).e.r +1
  }


  module.exports = {getMaxRows} 