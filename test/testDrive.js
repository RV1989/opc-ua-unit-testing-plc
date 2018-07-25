let opcua = require("node-opcua");
let chai = require("chai");
let readline = require("readline-sync");
var client = new opcua.OPCUAClient();
var endpointUrl = "opc.tcp://192.168.161.215:4840";
const expect = chai.expect;

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

let drivesXa02Gate1 = [
  { name: "RC 02020", hwId: 293 },
  { name: "RC 02021", hwId: 416 },
  { name: "RC 02030", hwId: 417 },
  { name: "RC 02031", hwId: 418 },
  { name: "RC 02040", hwId: 419 },
  { name: "RC 02041", hwId: 420 },
  { name: "RC 02050", hwId: 421 },
  { name: "RC 02051", hwId: 422 },
  { name: "RC 02060", hwId: 423 },
  { name: "RC 02061", hwId: 424 },
  { name: "RC 02070", hwId: 425 },
  { name: "RC 02071", hwId: 426 },
  { name: "RC 02080", hwId: 427 },
  { name: "RC 02081", hwId: 428 }
];

let drivesXa02Gate2 = [
  { name: "Rc 02090", hwId: 438 },
  { name: "RC 02091", hwId: 440 },
  { name: "RC 02100", hwId: 441 },
  { name: "RC 02101", hwId: 442 },
  { name: "RC 02110", hwId: 443 },
  { name: "RC 02111", hwId: 444 },
  { name: "RC 02120", hwId: 445 },
  { name: "RC 02121", hwId: 446 },
  { name: "RC 02130", hwId: 447 },
  { name: "RC 02131", hwId: 448 },
  { name: "RC 02140", hwId: 449 },
  { name: "RC 02141", hwId: 450 },
  { name: "RC 02142", hwId: 451 },
  { name: "RC 02143", hwId: 452 }
];

let drivesXa02Gate3 = [
  { name: "RC 02144", hwId: 462 },
  { name: "RC 02145", hwId: 464 },
  { name: "RC 02146", hwId: 465 },
  { name: "RC 02147", hwId: 466 },
  { name: "RC 02150", hwId: 467 },
  { name: "RC 02151", hwId: 468 },
  { name: "RC 02152", hwId: 469 },
  { name: "Rc 02153", hwId: 470 },
  { name: "RC 02154", hwId: 471 },
  { name: "Rc 02155", hwId: 472 },
  { name: "RC 02156", hwId: 473 },
  { name: "RC 02157", hwId: 474 },
  { name: "Rc 02160", hwId: 475 },
  { name: "RC 02161", hwId: 476 }
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
  { name: "RPortique 02310-02", hwId: 540 },
];

let allUfr = [drivesXa02Gate1,drivesXa02Gate2,drivesXa02Gate3,drivesXa02Gate4,drivesXa02Gate5,drivesXa02Gate6];

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
    it("Drive " + drive.name + " Speed should be 1500 ", async () => {
      let hwID = {
        dataType: "UInt16",
        value: drive.hwId
      };
      let Speed = {
        dataType: "Int16",
        value: 1500
      };
      // write hw id
      await writeVar(session, tagHwId, hwID);
      await writeVar(session, tagSpeed, Speed);
      await writeVar(session, tagForward, bool_true);
      await onDelay(1000);
      //askOkSpeed1500();
      let actualSpeed = await readVar(session, tagActualSpeed);
      expect(actualSpeed).to.be.above(1490);
    });

    it("Drive " + drive.name + " Speed should be 0", async () => {
      let hwID = {
        dataType: "UInt16",
        value: drive.hwId
      };
      // write hw id
      await writeVar(session, tagHwId, hwID);
      await writeVar(session, tagForward, bool_false);
      await onDelay(1100);
      //askOkSpeed0();
      let actualSpeed = await readVar(session, tagActualSpeed);
      expect(actualSpeed).to.be.equal(0);
    });
  }
}
});

function askOkSpeed1500() {
  return readline.question("Drive speed=1500 & contactor?");
}

function askOkSpeed0() {
  return readline.question("Drive speed=0 & contactor off?");
}
