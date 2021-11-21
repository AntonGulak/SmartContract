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

     constructor(solFile, network){

        this.soFfile = solFile;
        this.network = network;
        this.hash = crypto.createHash('md5').update(solFile).digest('hex');
     }
     

     async compileMethod() {

        //Create .sol file
        fs.writeFileSync(this.hash + ".sol", solFile, function (err) {
            if (err) return console.log(err);
         });

        //Compile

        await runCommand(consoleTerminal, "sol compile", {
            file: path.resolve(__dirname, this.hash + ".sol")
        });

        //Сформировываем dabi для экспорта
        const abi =  await JSON.parse(fs.readFileSync(this.hash + ".abi.json"));

        const dabi =  {
            dabi: Buffer.from(JSON.stringify(abi)).toString('base64'),
        };

        fs.writeFileSync(this.hash + ".dabi.json", JSON.stringify(dabi, null, '\t'));

        //Сформировываем tvc_decode для экспорта
        const tvc_string = fs.readFileSync(this.hash + ".tvc", {encoding: 'base64'});
        const client = new TonClient();
        const boc = new BocModule(client);
        const temp = await boc.decode_tvc({ tvc: tvc_string});
        fs.writeFileSync(this.hash + ".decode.json", JSON.stringify(temp, null, '\t'));
        client.close();

     }


     async deployMethod() {

        const client = new TonClient({
            network: {
                endpoints: [this.network]
            }
        });

        const AccContract = {
            abi: JSON.parse(fs.readFileSync(this.hash + ".abi.json")),
            tvc: fs.readFileSync(this.hash + ".tvc", {encoding: 'base64'}),
        };

    
        //Сформировываем связку ключей
        const keys = await client.crypto.generate_random_sign_keys();
    
        //json связки ключей
        const signer = await signerKeys(keys);

        //предварительно создаем контракт
        const acc = new Account(AccContract, { signer, client });
    
        //получаем адрес будущего контракта
        const address = await acc.getAddress();
    
        console.log(`New account future address: ${address}`);
    
        //Деплоим
        try {
            await acc.deploy({ useGiver: true });
        } catch(err) {
            console.error(err);
        } finally {
            console.log(`Hello contract was deployed at address: ${address}`);
            client.close();
        }
     } //end methoddeploy

  

    getTvcDecode() {
        return  JSON.parse(fs.readFileSync(this.hash + ".decode.json"));;
    }

    getDabi() {
        return  JSON.parse(fs.readFileSync(this.hash + ".dabi.json"));;
    }

 


} //end class


// const endpoints = "http://localhost"
// const solFile = "pragma ton-solidity >= 0.35.0; pragma AbiHeader expire; contract helloworld {function renderHelloWorld () public pure returns (string) {return 'helloWorld';}}";

// let d = new CompileAndDeploy(solFile, endpoints);
// d.compileMethod();
// d.deployMethod();
// console.log(d.getTvcDecode());
// console.log(d.getDabi());
 
 
