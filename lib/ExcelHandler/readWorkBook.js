//@ts-check
const XLSX = require('xlsx')
const _ = require('lodash');

/**
 * 
 * @param {string} path 
 * @returns {Promise}
 */
const readWorkBook = async (path) => {
    return new Promise((resolve, reject) => {
      try {
        let workbookPath = path
        if (workbookPath.match(/(.xlsx+)|(.xlsm)|(.xls)/g)) {
            /**
             * @type {XLSX.WorkBook}
             */
          var workbook = XLSX.readFile(workbookPath)
        }
  
        if (workbook) {
          resolve(workbook)
        } else {
          reject(onerror('An error has occured while reading the workbook'))
        }
      } catch (err) {
        reject(err.message )
      }
    })
  }

  module.exports = {readWorkBook}