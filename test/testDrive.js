let opcua = require("node-opcua");
let chai = require("chai");
let readline = require("readline-sync");
var client = new opcua.OPCUAClient();
const expect = chai.expect;

var endpointUrl = "opc.tcp://172.16.3.1:4840";

const maxSpeed =2500
const ramp = 2000
let drivesXa02Gate1 = [
  { name: "RC 03290", hwId: 477 },
  { name: "RC 03291", hwId: 479 },
  { name: "RC 03230", hwId: 480 },
  { name: "RC 03160", hwId: 481 },
  { name: "RC 03300", hwId: 482 },
  { name: "RC 03301", hwId: 483 },
  { name: "RC 03240", hwId: 484 },
  { name: "RC 03170", hwId: 485 },
  { name: "RC 03310", hwId: 486 },
  { name: "RC 03311", hwId: 487 },
  { name: "RC 03250", hwId: 488 },
  { name: "RC 03180", hwId: 489 },
  { name: "RC 03193", hwId: 490 },
  { name: "lift-garant-03230", hwId: 491 },
  { name: "lift-garant-03240", hwId: 492 },
  { name: "lift-garant-03250", hwId: 493 },
];

let drivesXa02Gate2 = [
  { name: "Rc 03192", hwId: 501 },
  { name: "RC 03191", hwId: 503 },
  { name: "RC 03190", hwId: 504 },
  { name: "RC 03320", hwId: 505 },
  { name: "RC 03321", hwId: 506 },
  { name: "RC 03260", hwId: 507 },
  { name: "RC 03200", hwId: 508 },
  { name: "RC 03330", hwId: 509 },
  { name: "RC 03331", hwId: 510 },
  { name: "RC 03270", hwId: 511 },
  { name: "RC 03210", hwId: 512 },
  { name: "RC 03340", hwId: 513 },
  { name: "RC 03341", hwId: 514 },
  { name: "RC 03280", hwId: 515 },
  { name: "RC lift-garant-03260", hwId: 516 },
  { name: "RC lift-garant-03270", hwId: 517 },
 
];

let drivesXa02Gate3 = [
  { name: "RC 03220", hwId: 540 },
  { name: "RC lift-garant-03280", hwId: 541 },

];
let drivesXa02Gate4 = [
  { name: "RC 02162", hwId: 486 },
  { name: "RC 02170", hwId: 488 },
  { name: "RC 02180", hwId: 489 },
  { name: "RC 02171", hwId: 490 },
  { name: "RC 02181", hwId: 491 },
  { name: "RC 02172", hwId: 492 },
  { name: "RC 02210", hwId: 493 },
  { name: "Rc 02211", hwId: 494 },
  { name: "RC 02212", hwId: 495 },
  { name: "Rc 02213", hwId: 496 },
  { name: "RC 02214", hwId: 497 },
  { name: "RC 02215", hwId: 498 },
  { name: "Rc 02216", hwId: 499 },
  { name: "RC 02217", hwId: 500 }
];
let drivesXa02Gate5 = [
  { name: "RC 02218", hwId: 510 },
  { name: "RC 02219", hwId: 512 },
  { name: "RC 02230", hwId: 513 },
  { name: "RC 02231", hwId: 514 },
  { name: "RC 02240", hwId: 515 },
  { name: "RC 02241", hwId: 516 },
  { name: "RC 02242", hwId: 517 },
  { name: "Rc 02250", hwId: 518 },
  { name: "RC 02251", hwId: 519 },
  { name: "Rc 02252", hwId: 520 },
  { name: "RC 02253", hwId: 521 },
  { name: "RC 02260", hwId: 522 },
  { name: "Rc 02261", hwId: 523 },
  { name: "RC 02262", hwId: 524 }
];

let drivesXa02Gate6 = [
  { name: "RC 02263", hwId: 534 },
  { name: "RC 02264", hwId: 536 },
  { name: "RC 02265", hwId: 537 },
  { name: "RC 02190", hwId: 538 },
  { name: "RPortique 02310-01", hwId: 539 },
  { name: "RPortique 02310-02", hwId: 540 },]


 let allUfr = [drivesXa02Gate1,drivesXa02Gate2, drivesXa02Gate3];


// timer
const onDelay = function(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

// connect function
const connect = async function(serverAdress) {
  return new Promise((resolve, reject) => {
    //console.log("trying to connect")
    client.connect(serverAdress, function(err) {
      if (err) {
        //console.log(" cannot connect to endpoint :", serverAdress);
        return reject(err);
      } else {
        //console.log("connected")
        return resolve();
      }
    });
  });
};

// create session
const createSession = async function() {
  return new Promise((resolve, reject) => {
    client.createSession(function(err, session) {
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

const closeSession = async function(session) {
  return new Promise((resolve, reject) => {
    session.close(function(err) {
      if (!err) {
        //console.log(dataValue);
        return resolve();
      } else {
        return reject(err);
      }
    });
  });
};

const readVar = async function(session, variable) {
  return new Promise((resolve, reject) => {
    session.readVariableValue(variable, function(err, dataValue) {
      if (!err) {
        //console.log(dataValue);
        return resolve(dataValue.value.value);
      } else {
        return reject(err);
      }
    });
  });
};

const writeVar = async function(session, variable, dataToWrite) {
  return new Promise((resolve, reject) => {
    session.writeSingleNode(variable, dataToWrite, function(err, stat) {
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
    await connect(endpointUrl);
    session = await createSession();
    await writeVar(session, tagDev, bool_true);
  });

  after(async () => {
    await writeVar(session, tagDev, bool_false);
    await closeSession(session);
  });

  for (let ufr of allUfr){
  for (let drive of ufr) {
    it("Drive " + drive.name + " Speed should be "+ maxSpeed, async () => {
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
      expect(actualSpeed).to.be.above(maxSpeed-50);
    });

    it("Drive " + drive.name + " Speed should be 0", async () => {
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
      expect(actualSpeed).to.be.equal(0);
    });
 
  }
}
});

function askOkSpeed1500(drivename) {
  return readline.question(drivename +" speed= " +maxSpeed+" & contactor?");
}

function askOkSpeed0(drivename) {
  return readline.question(drivename+" speed= 0 & contactor off?");
}
