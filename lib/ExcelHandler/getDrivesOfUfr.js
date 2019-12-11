

const getDrives = async (hwIdConfig , ufrConfig , ufr) => {
    let drives = await ufrConfig.filter( drive => drive.ufr == ufr.pnName )
    let returnDrives = []
    for ( drive of drives){
        let hwId= hwIdConfig.find(x =>x.hwIdName.includes(ufr.pnName) && x.hwIdName.includes(drive.pnName)  )
        returnDrives.push(hwId)

    }

  return returnDrives




;
}
module.exports = {getDrives}