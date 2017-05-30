let opcua = require("node-opcua");
let chai = require('chai');
var client = new opcua.OPCUAClient();
var endpointUrl = "opc.tcp://192.168.0.1:4840";
const expect = chai.expect;

// timer
const timeout = function(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}
// connect function
const connect = async function(serverAdress) {
  return new Promise((resolve, reject) => {
    //console.log("trying to connect")
    client.connect(serverAdress, function(err) {
      if (err) {
        //console.log(" cannot connect to endpoint :", serverAdress);
        return reject(err)
      } else {

        //console.log("connected")
        return resolve()
      }

    });
  });
}

// create session
const createSession = async function() {
  return new Promise((resolve, reject) => {
    client.createSession(function(err, session) {
      if (!err) {
        //console.log("session created")
        return resolve(session);
      } else {
        //console.log("failed to create session")
        return reject(err)
      }

    });
  });
}

const readVar = async function(session, variable) {
  return new Promise((resolve, reject) => {

    session.readVariableValue(variable, function(err, dataValue) {
      if (!err) {
        //console.log(dataValue.value.value)
        return resolve(dataValue.value.value)

      } else {
        return reject(err)
      }
    });

  });
}

const writeVar = async function(session, variable, dataToWrite) {
  return new Promise((resolve, reject) => {
    session.writeSingleNode(variable, dataToWrite, function(err, stat) {
      if (!err) {
        //console.log(" write ok" );
        return resolve()
      } else {
        //console.log(" write err = " ,err);
        return reject(err)
      }


    })


  })



}

// test start here

describe('Test', () => {

  let session

  before(async() => {
    await connect(endpointUrl);
    session = await createSession();
  })

  afterEach(async() => {
    let bool_true = {
      dataType: "Boolean",
      value: true
    };
    let bool_false = {
      dataType: "Boolean",
      value: false
    };
    //reset all after each test and reset errors
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX34.0 Reset zone"', bool_false)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.0 Automatic"', bool_false)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.5 Safety stop"', bool_false)
    await writeVar(session, 'ns=3;s="myTestDB"."fake stop"', bool_false)
    await writeVar(session, 'ns=3;s="DB1064 RC 10505"."DBX31.4 Ready for acceptance forwards"', bool_false)
    await writeVar(session, 'ns=3;s="DB1062 RC 10503"."DBX31.0 Ready for release forwards"', bool_false)
    await writeVar(session, 'ns=3;s="DB1063 RC 10504"."DBX31.0 Ready for release forwards"', bool_false)
    await writeVar(session, 'ns=3;s="CoreDB *Zone 105*"."zone"."PLC GLA"."Zone on"', bool_false)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.2 System in coldstart"', bool_false)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.1 Manual"', bool_false)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX31.0 Action for manual"', bool_false)
    await writeVar(session, 'ns=3;s="DB1063 RC 10504"."DBX38.0 Select forwards (display)"', bool_false)
    await writeVar(session, 'ns=3;s="DB1063 RC 10504"."DBX32.0 Occupancy"', bool_false)
    await writeVar(session, 'ns=3;s="DB1063 RC 10504"."DBX31.1 Release in progress forwards"', bool_false)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX34.0 Reset zone"', bool_true)
    await Promise.resolve(timeout(10));
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX34.0 Reset zone"', bool_false)


  })

  it("var 2 should be true if var 1 is", async() => {
// simple test ---][-------()-----
    let data = {
      dataType: "Boolean",
      value: true
    };
    await writeVar(session, 'ns=3;s="myTestDB"."var1"', data)
    await Promise.resolve(timeout(10));
    let readVal = await readVar(session, 'ns=3;s="myTestDB"."var2"');
    expect(readVal).to.be.true
  });

  it("var 2 should be false if var 1 is", async() => {
// simple test ---][-------()-----
    let data = {
      dataType: "Boolean",
      value: false
    };
    await writeVar(session, 'ns=3;s="myTestDB"."var1"', data)
    await Promise.resolve(timeout(10));
    let readVal = await readVar(session, 'ns=3;s="myTestDB"."var2"');

    expect(readVal).to.be.false;

  });

  it("Should turn forward manual", async() => {
// manual test zone
    let bool_true = {
      dataType: "Boolean",
      value: true
    };
    let bool_false = {
      dataType: "Boolean",
      value: false
    };
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.1 Manual"', bool_true)
    await writeVar(session, 'ns=3;s="myTestDB"."fake stop"', bool_false)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.0 Automatic"', bool_false)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX31.0 Action for manual"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.5 Safety stop"', bool_true)
    await writeVar(session, 'ns=3;s="DB1063 RC 10504"."DBX38.0 Select forwards (display)"', bool_true)
    await Promise.resolve(timeout(10));
    let Output_forward = await readVar(session, 'ns=3;s="DB1063 RC 10504"."DBX33.0 Movement forwards"');
    expect(Output_forward).to.be.true;
    // check if when releasing the action button the conveyor stops
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX31.0 Action for manual"', bool_false)
    Output_forward = await readVar(session, 'ns=3;s="DB1063 RC 10504"."DBX33.0 Movement forwards"');
    expect(Output_forward).to.be.false;


  });

  it("Should turn backwards manual", async() => {
// manual test zone
    let bool_true = {
      dataType: "Boolean",
      value: true
    };
    let bool_false = {
      dataType: "Boolean",
      value: false
    };
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.1 Manual"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.0 Automatic"', bool_false)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX31.0 Action for manual"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.5 Safety stop"', bool_true)
    await writeVar(session, 'ns=3;s="DB1063 RC 10504"."DBX38.1 Select backwards (display)"', bool_true)
    await Promise.resolve(timeout(10));
    let Output_forward = await readVar(session, 'ns=3;s="DB1063 RC 10504"."DBX33.1 Movement backwards"');
    expect(Output_forward).to.be.true;
    // check if releasing the button the conveyor stops
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX31.0 Action for manual"', bool_false)
    Output_forward = await readVar(session, 'ns=3;s="DB1063 RC 10504"."DBX33.0 Movement forwards"');
    expect(Output_forward).to.be.false;


  });

  it("Should accept forwards", async() => {
//check pallet acceptance of conveyor
    let bool_true = {
      dataType: "Boolean",
      value: true
    };
    let bool_false = {
      dataType: "Boolean",
      value: false
    };
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.0 Automatic"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.5 Safety stop"', bool_true)
    await writeVar(session, 'ns=3;s="DB1062 RC 10503"."DBX31.0 Ready for release forwards"', bool_true)
    await writeVar(session, 'ns=3;s="CoreDB *Zone 105*"."zone"."PLC GLA"."Zone on"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.2 System in coldstart"', bool_true)
    await Promise.resolve(timeout(10));
    let Output_forward = await readVar(session, 'ns=3;s="DB1063 RC 10504"."DBX33.0 Movement forwards"');
    expect(Output_forward).to.be.true;




  });

  it("Should not go in timeout when exceptance", async() => {
//conveyor should not time out when excepting
    let bool_true = {
      dataType: "Boolean",
      value: true
    };
    let bool_false = {
      dataType: "Boolean",
      value: false
    };
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.0 Automatic"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.5 Safety stop"', bool_true)
    await writeVar(session, 'ns=3;s="DB1062 RC 10503"."DBX31.0 Ready for release forwards"', bool_true)
    await writeVar(session, 'ns=3;s="CoreDB *Zone 105*"."zone"."PLC GLA"."Zone on"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.2 System in coldstart"', bool_true)
    await Promise.resolve(timeout(10));
    let Output_forward = await readVar(session, 'ns=3;s="DB1063 RC 10504"."DBX33.0 Movement forwards"');
    expect(Output_forward).to.be.true;
    // wait 20s to check if error
    await Promise.resolve(timeout(20000));
    let timeout_fault = await readVar(session, 'ns=3;s="DB1063 RC 10504"."Alarms"."DBX0.0 Runtime error"');
    expect(timeout_fault).to.be.false;

  });

  it("Should Release forwards", async() => {
// check if conveyor is releasing pallet
    let bool_true = {
      dataType: "Boolean",
      value: true
    };
    let bool_false = {
      dataType: "Boolean",
      value: false
    };
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.0 Automatic"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.5 Safety stop"', bool_true)
    await writeVar(session, 'ns=3;s="CoreDB *Zone 105*"."zone"."PLC GLA"."Zone on"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.2 System in coldstart"', bool_true)
    await writeVar(session, 'ns=3;s="myTestDB"."fake stop"', bool_true)
    await writeVar(session, 'ns=3;s="DB1063 RC 10504"."DBX32.0 Occupancy"', bool_true)
    await writeVar(session, 'ns=3;s="DB1064 RC 10505"."DBX31.4 Ready for acceptance forwards"', bool_true)
    await Promise.resolve(timeout(1000));
    let Output_forward = await readVar(session, 'ns=3;s="DB1063 RC 10504"."DBX33.0 Movement forwards"');
    expect(Output_forward).to.be.true;

  });

  it("Should timeout on Release forwards", async() => {
// the conveyor should time out when releasing
    let bool_true = {
      dataType: "Boolean",
      value: true
    };
    let bool_false = {
      dataType: "Boolean",
      value: false
    };
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.0 Automatic"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.5 Safety stop"', bool_true)
    await writeVar(session, 'ns=3;s="CoreDB *Zone 105*"."zone"."PLC GLA"."Zone on"', bool_true)
    await writeVar(session, 'ns=3;s="DB1060 *Zone 105*"."DBX30.2 System in coldstart"', bool_true)
    await writeVar(session, 'ns=3;s="myTestDB"."fake stop"', bool_true)
    await writeVar(session, 'ns=3;s="DB1063 RC 10504"."DBX32.0 Occupancy"', bool_true)
    await writeVar(session, 'ns=3;s="DB1064 RC 10505"."DBX31.4 Ready for acceptance forwards"', bool_true)
    await Promise.resolve(timeout(1000));
    let Output_forward = await readVar(session, 'ns=3;s="DB1063 RC 10504"."DBX33.0 Movement forwards"');
    expect(Output_forward).to.be.true;
    await Promise.resolve(timeout(20000));
    let timeout_fault = await readVar(session, 'ns=3;s="DB1063 RC 10504"."Alarms"."DBX0.0 Runtime error"');
    expect(timeout_fault).to.be.true;

  });



});
