let opcua = require("node-opcua");
let chai = require("chai");
let readline = require("readline-sync");
var client = new opcua.OPCUAClient();
const expect = chai.expect;
const getUfrs = require('../ExcelHandler/getUfrs')
const config = require('../../Myconfig')

var endpointUrl = "opc.tcp://10.20.24.2:4840";

const maxSpeed = 2500
const ramp = 2000

let drivesXa01Gate2 = {}
drivesXa01Gate2.drivesId = [
  { hwIdName: "TT 42030", hwId: 367 },
  { hwIdName: "RC 42031", hwId: 356 },

];
//let allUfr =[]
//await getUfrs.getUfrs(config.ufrConfig)

let allUfr = [];
//let  allUfr = await getUfrs.getUfrs(config.ufrConfig)




// timer
const onDelay = function (delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

// connect function
const connect = async function (serverAdress) {
  return new Promise((resolve, reject) => {
    //console.log("trying to connect")
    client.connect(serverAdress, function (err) {
      if (err) {
        console.log(" cannot connect to endpoint :", serverAdress);
        return reject(err);
      } else {
        console.log("connected")
        return resolve();
      }
    });
  });
};

// create session
const createSession = async function () {
  return new Promise((resolve, reject) => {
    client.createSession(function (err, session) {
      if (!err) {
        //console.log("session created")
        return resolve(session);
      } else {
        //console.log("failed to create session")
        return reject(err);
      }
    });
  });
};

const closeSession = async function (session) {
  return new Promise((resolve, reject) => {
    session.close(function (err) {
      if (!err) {
        //console.log(dataValue);
        return resolve();
      } else {
        return reject(err);
      }
    });
  });
};

const readVar = async function (session, variable) {
  return new Promise((resolve, reject) => {
    session.readVariableValue(variable, function (err, dataValue) {
      if (!err) {
        //console.log(dataValue);
        return resolve(dataValue.value.value);
      } else {
        return reject(err);
      }
    });
  });
};

const writeVar = async function (session, variable, dataToWrite) {
  return new Promise((resolve, reject) => {
    session.writeSingleNode(variable, dataToWrite, function (err, stat) {
      if (!err) {
        //console.log(" write ok" );
        return resolve();
      } else {
        //console.log(" write err = " ,err);
        return reject(err);
      }
    });
  });
};



describe("Drive Test", () => {
  

  let session;
  let tagDev = 'ns=3;s="dev"."modeDev"';
  let tagForward = 'ns=3;s="dev"."forward"';
  let tagHwId = 'ns=3;s="dev"."hwID"';
  let tagSpeed = 'ns=3;s="dev"."speed"';
  let tagActualSpeed = 'ns=3;s="dev"."actualSpeed"';

  let bool_true = {
    dataType: "Boolean",
    value: true
  };
  let bool_false = {
    dataType: "Boolean",
    value: false
  };

  before(async () => {

    allUfr = await getUfrs.getUfrs(config.ufrConfig)
    await connect(endpointUrl);
    session = await createSession();
    return await writeVar(session, tagDev, bool_true);

  });

  after(async () => {
    await writeVar(session, tagDev, bool_false);
    await closeSession(session);

  });

  it('dummy', function (done) {
    describe('testing Drives', async   ()=> {
      
      for (let ufr of allUfr) {
        for (let drive of ufr.drivesId) {
          
          await it(drive.hwIdName + " Speed should be " + maxSpeed, async () => {
            let hwID = {
              dataType: "UInt16",
              value: drive.hwId
            };
            let Speed = {
              dataType: "Int16",
              value: maxSpeed
            };
            // write hw id
            await writeVar(session, tagHwId, hwID);
            await writeVar(session, tagSpeed, Speed);
            await writeVar(session, tagForward, bool_true);
            await onDelay(ramp + 500);
            //askOkSpeed1500(drive.name);
            let actualSpeed = await readVar(session, tagActualSpeed);
            return expect(actualSpeed).to.be.above(maxSpeed - 50);
          });

         await  it(drive.hwIdName + " Speed should be 0", async () => {
            let hwID = {
              dataType: "UInt16",
              value: drive.hwId
            };
            // write hw id
            await writeVar(session, tagHwId, hwID);
            await writeVar(session, tagForward, bool_false);
            await onDelay(ramp + 500);
            //askOkSpeed0(drive.name);
            let actualSpeed = await readVar(session, tagActualSpeed);
            return expect(actualSpeed).to.be.equal(0);
          });

        }
      }
     

    })
  });

});



  function askOkSpeed1500(drivename) {
    return readline.question(drivename + " speed= " + maxSpeed + " & contactor?");
  }

  function askOkSpeed0(drivename) {
    return readline.question(drivename + " speed= 0 & contactor off?");
  }
