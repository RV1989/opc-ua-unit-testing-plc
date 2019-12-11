let readUfrConfig = require("./readUfrConfig");
let getDrivesOfUfr = require('./getDrivesOfUfr');
let readUfrHwId = require("./readUfrHwId");
const config= require('../../Myconfig')

const getUfrs = async (workbookPath) => {
    let ufrConfig = await readUfrConfig.readUfrConfig(workbookPath)
    let hwIDConfig = await  readUfrHwId.readUfrHwId (workbookPath)
    let ufr = ufrConfig.filter( row => row.gsd.includes('/DAP/'))
       
    //console.log(ufr)

    for (u of ufr){
        let drive = await  getDrivesOfUfr.getDrives(hwIDConfig, ufrConfig, u )
        //console.log(drive)
        u.drivesId = drive
        //console.log(u)

    }

    return(ufr)

;
}

module.exports = {getUfrs}

getUfrs(config.ufrConfig)