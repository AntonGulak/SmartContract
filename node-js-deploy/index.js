const {TonClient, signerKeys, BocModule} = require("@tonclient/core");
const {libNode} = require("@tonclient/lib-node");
const { Account } = require("@tonclient/appkit");
const { consoleTerminal, runCommand, downloadFromGithub} = require("tondev");
const path = require("path");
const fs = require('fs');
const crypto = require('crypto');

TonClient.useBinaryLibrary(libNode);



// Application initialization
class CompileAndDeploy {

     constructor(solFile){

        this.client = new TonClient({
            network: {
                endpoints: ["http://localhost"]
            }
        });

        const hash = crypto.createHash('md5').update(solFile).digest('hex');

        //Create .sol file
        fs.writeFile(hash + ".sol", solFile, function (err) {
            if (err) return console.log(err);
         });

        //Compile
        runCommand(consoleTerminal, "sol compile", {
            file: path.resolve(__dirname, hash + ".sol")
        });
    
        this.tvc_string = fs.readFileSync(hash + ".tvc", {encoding: 'base64'});
    
        this.abi =  JSON.parse(fs.readFileSync(hash + ".abi.json"));
     }


     async deploy() {

        const AccContract = {
            abi: this.abi,
            tvc: this.tvc_string,
        };
    
        //Сформировываем связку ключей
        const keys = await this.client.crypto.generate_random_sign_keys();
    
        //json связки ключей
        const signer = await signerKeys(keys);

        tempClient = this.client;

        //предварительно создаем контракт
        const acc = new Account(AccContract, { signer, tempClient });
    
        //получаем адрес будущего контракта
        const address = await acc.getAddress();
    
        console.log(`New account future address: ${address}`);
    
        //Деплоим
        await acc.deploy({ useGiver: true });
        console.log(`Hello contract was deployed at address: ${address}`);
     }

     getDabi() {
        var dabi = {
            dabi: Buffer.from(JSON.stringify(abi)).toString('base64'),
        };

        return dabi;
     }

     async getTvcDecode() {
        const boc = new BocModule(client);

        parametr = {
            tvc: tvc_string
        }
    
        const temp = await boc.decode_tvc(parametr);

        return JSON.stringify(temp);
     }


} //end class


//const endpoints = "http://localhost"
const solFile = "pragma ton-solidity >= 0.35.0; pragma AbiHeader expire; contract helloworld {function renderHelloWorld () public pure returns (string) {return 'helloWorld';}}";

let d = new CompileAndDeploy(solFile);
d.deploy();