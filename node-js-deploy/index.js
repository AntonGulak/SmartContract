const {TonClient} = require("@tonclient/core");
const {libNode} = require("@tonclient/lib-node");
const { Account } = require("@tonclient/appkit");
const { consoleTerminal, runCommand } = require("tondev");
const path = require("path");
const fs = require('fs');



// Application initialization

TonClient.useBinaryLibrary(libNode)


async function main(client) {
}

(async () => {
    const endpoint =  "http://localhost";
    const client = new TonClient({ network: { endpoints: [endpoint] } });
    try {
        await main(client);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
})();

async function main(client) {

    await runCommand(consoleTerminal, "sol compile", {
        file: path.resolve(__dirname, "helloworld.sol")
    });

    const tvc_string = fs.readFileSync("helloworld.tvc", {encoding: 'base64'});

       
    var jsonFile = "helloworld.abi.json";
    var abi= JSON.parse(fs.readFileSync(jsonFile));
    
    console.log(abi);

    const AccContract = {
        abi: { /* ABI declarations */ },
        tvc: tvc_string,
    };
    
    const keys = await client.crypto.generate_random_sign_keys();

    const signer = await keys.public;

    //const acc = new Account(AccContract, { signer, client });

    //console.log(`New account future address: ${await acc.getAddress()}`);
}