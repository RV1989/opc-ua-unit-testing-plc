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

let drivesUfr07 = [
  { name: "RC 39150", hwId: 650 },
  { name: "RC 39190", hwId: 651 },
  { name: "RC 39070", hwId: 652 },
  { name: "RC 39071", hwId: 653 },
  { name: "Turn 39071", hwId: 654 },
  { name: "RC 39072", hwId: 655 },
  { name: "RC 39073", hwId: 657 },
  { name: "RC 39080", hwId: 658 },
  { name: "Turn 39080", hwId: 659 },
  { name: "RC 39081", hwId: 660 },
  { name: "RC 39082", hwId: 661 },
  { name: "RC 39083", hwId: 662 }
];

let drivesUfr08 = [
  { name: "Dummy 39120-03", hwId: 671 },
  { name: "RC 39090", hwId: 686 },
  { name: "RC 39091", hwId: 687 },
  { name: "Turn 39091", hwId: 688 },
  { name: "RC 39092", hwId: 689 },
  { name: "RC 39093", hwId: 690 },
  { name: "RC 39100", hwId: 691 },
  { name: "Turn 39100", hwId: 692 },
  { name: "RC 39101", hwId: 693 },
  { name: "RC 39102", hwId: 694 },
  { name: "Dummy 39110-3", hwId: 695 },
  { name: "RC 39110", hwId: 696 },
  { name: "Turn 39110", hwId: 697 },
  { name: "RC 39111", hwId: 698 }
];

let drivesUfr09 = [
  { name: "Dummy 39350-03", hwId: 710 },
  { name: "RC 39350", hwId: 740 },
  { name: "Turn 39350", hwId: 741 },
  { name: "RC 39351", hwId: 742 },
  { name: "RC 39352", hwId: 743 },
  { name: "RC 39353", hwId: 744 },
  { name: "RC 39360", hwId: 745 },
  { name: "Turn 39360", hwId: 746 },
  { name: "Dummy 39360-3", hwId: 747 },
  { name: "Dummy 39362-1-2", hwId: 748 },
  { name: "RC 39400", hwId: 749 },
  { name: "RC 39401", hwId: 750 },
  { name: "Turn 39401", hwId: 751 },
  { name: "Turn 39402", hwId: 752 }
];

let drivesUfr10 = [
  { name: "RC 39403", hwId: 762 },
  { name: "RC 39404", hwId: 807 },
  { name: "RC 39420", hwId: 808 },
  { name: "Turn 39420", hwId: 809 },
  { name: "RC 39410", hwId: 810 },
  { name: "RC 39420-3", hwId: 811 }
];

let allUfr = [drivesUfr07, drivesUfr08, drivesUfr09, drivesUfr10];

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
