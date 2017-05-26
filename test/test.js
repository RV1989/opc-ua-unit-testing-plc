let opcua = require("node-opcua");
let chai = require('chai');
var client = new opcua.OPCUAClient();
var endpointUrl = "opc.tcp://localhost:4334/UA/MyLittleServer";
const expect = chai.expect;

// timer
const timeout = function (delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, delay)
    })
}
// connect function
const connect = async function (serverAdress) {
    return new Promise((resolve, reject) => {
        console.log("trying to connect")
        client.connect(serverAdress, function (err) {
            if (err) {
                console.log(" cannot connect to endpoint :", serverAdress);
                return reject(err)
            } else {

                console.log("connected")
                return resolve()
            }

        });
    });
}

// create session
const createSession = async function () {
    return new Promise((resolve, reject) => {
        client.createSession(function (err, session) {
            if (!err) {
                console.log("session created")
                return resolve(session);
            } else {
                console.log("failed to create session")
                return reject(err)
            }

        });
    });
}

const readVar = async function (session, variable) {
    return new Promise((resolve, reject) => {

        session.readVariableValue(variable, function (err, dataValue) {
            if (!err) {
                console.log(dataValue.value.value)
                return resolve(dataValue.value.value)

            } else {
                return reject(err)
            }
        });

    });
}

// test start here
 describe('Test',  () => {
     let session

    before(async () => {
        await connect(endpointUrl);
        session = await createSession();
          })

        it("Test myvariable 2 is true", async () => {
            //console.log("reading value")
            let readVal = await readVar(session, "ns=1;s=MyVariable2");
            expect(readVal).to.equal(true);
        });
    });




