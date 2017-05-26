let opcua = require("node-opcua");
let chai = require('chai');
var client = new opcua.OPCUAClient();
var endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";

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
                return resolve(session);
            } else {
                return reject(err)
            }

        });
    });
}

const readVar = async function (session, variable) {
    return new Promise((resolve, reject) => {

        session.readVariableValue(variable, function (err, dataValue) {
            if (!err) {
                console.log(dataValue.toString())
                return resolve(dataValue.toString())

            } else {
                return reject(err)
            }
        });

    });
}

// test start here
async function main() {
    console.log("connecting");
    await connect(endpointUrl);
    let session = await createSession();

    describe('Test',  () => {
        it("Test free memory", async () => {
            let readVal = await readVar(session, "ns=1;s=free_memory");
            expect(readVal).to.equal("True");
        });
    });


}

main()