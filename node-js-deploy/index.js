const {TonClient, signerKeys} = require("@tonclient/core");
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

    const tvc_string = await fs.readFileSync("helloworld.tvc", {encoding: 'base64'});

    const abi = await JSON.parse(fs.readFileSync("helloworld.abi.json"));

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
}