const {TonClient, signerKeys} = require("@tonclient/core");
const {libNode} = require("@tonclient/lib-node");
const { Account } = require("@tonclient/appkit");
const { consoleTerminal, runCommand} = require("tondev");
const path = require("path");
const fs = require('fs');
const crypto = require('crypto');



// Application initialization

TonClient.useBinaryLibrary(libNode)

async function main(client) {
}

(async () => {
    const client = new TonClient({
        network: {
            endpoints: ["http://localhost"]
        }
    });
    try {
        console.log("Hello localhost TON!");
        await main(client);
        process.exit(0);
    } catch (error) {
        if (error.code === 504) {
            console.error(`Network is inaccessible.`);
        } else {
            console.error(error);
        }
    }
    client.close();
})();

async function main(client) {
    const solFile = "pragma ton-solidity >= 0.35.0; pragma AbiHeader expire; contract helloworld {function renderHelloWorld () public pure returns (string) {return 'helloWorld';}}";
    
    const hash = crypto.createHash('md5').update(solFile).digest('hex');

    fs.writeFile(hash + ".sol", solFile, function (err) {
        if (err) return console.log(err);
        console.log('Create!');
     });

    await runCommand(consoleTerminal, "sol compile", {
        file: path.resolve(__dirname, hash + ".sol")
    });

    const tvc_string = await fs.readFileSync(hash + ".tvc", {encoding: 'base64'});

    const abi = await JSON.parse(fs.readFileSync(hash + ".abi.json"));

    const AccContract = {
        abi: abi,
        tvc: tvc_string,
    };

    //Сформировываем связку ключей
    const keys = await client.crypto.generate_random_sign_keys();

    //abi связки ключей
    const signer = await signerKeys(keys);

    //предварительно создаем контракт
    const acc = new Account(AccContract, { signer, client });

    //получаем адресс будущего контракта
    const address = await acc.getAddress();

    console.log(`New account future address: ${address}`);

    //Деплоим
    await acc.deploy({ useGiver: true });
    console.log(`Hello contract was deployed at address: ${address}`);


    var dabi = {
        dabi: Buffer.from(JSON.stringify(abi)).toString('base64'),
    };

    console.log(decode_tvc( {
        tvc: tvc_string
    }));

}