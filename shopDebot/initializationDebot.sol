pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "../base/Debot.sol";
import "../base/Terminal.sol";
import "../base/Menu.sol";
import "../base/AddressInput.sol";
import "../base/ConfirmInput.sol";
import "../base/Upgradable.sol";
import "../base/Sdk.sol";
import "shop.sol";

abstract contract initializationDebot is Debot, Upgradable {

    bytes m_icon;

    TvmCell m_todoCode;
    TvmCell m_todoStateInit;
    TvmCell m_todoData;
    address m_address;  
    ShopInter.Stat m_stat;
    uint32 m_taskId;
    uint256 m_masterPubKey;
    address m_msigAddress;
    uint32 INITIAL_BALANCE =  200000000;   

    function statToString() public view returns (string) {
        return format(
                "You have {}/{}/{} (todo/done/total) tasks  for a total of {}",
                    m_stat.incompleteCount,
                    m_stat.completeCount,
                    m_stat.completeCount + m_stat.incompleteCount,
                    m_stat.amountPrice
            );
    }

    function getDebotInfo() public functionID(0xDEB) override view returns(
        string name, string version, string publisher, string key, string author,
        address support, string hello, string language, string dabi, bytes icon
    ) {
        name = "TODO DeBot";
        version = "0.2.0";
        publisher = "";
        key = "Shop list manager";
        author = "Anton Gulak";
        support = address.makeAddrStd(0, 0x59f2168905be6fbe0295e1b7fda59ab786006c8f25e23373e82b4210016f9e47);
        hello = "Hi, i'm a ShopList DeBot.";
        language = "en";
        dabi = m_debotAbi.get();
        icon = m_icon;
    }
    
    function onCodeUpgrade() internal override {
        tvm.resetStorage();
    }    

    function getRequiredInterfaces() public view override returns (uint256[] interfaces) {
        return [ Terminal.ID, Menu.ID, AddressInput.ID, ConfirmInput.ID ];
    }




    function start() public override {
        Terminal.input(tvm.functionId(savePublicKey),"Please enter your public key",false);
    }

     function savePublicKey(string value) public {
        (uint res, bool status) = stoi("0x"+value);
        if (status) {
            m_masterPubKey = res;

            Terminal.print(0, "Checking if you already have a Shoplist ...");
           
            TvmCell deployState = tvm.insertPubkey(m_todoStateInit, m_masterPubKey);
            m_address = address.makeAddrStd(0, tvm.hash(deployState));
            Terminal.print(0, format( "Info: your ShopList contract address is {}", m_address));
            Sdk.getAccountType(tvm.functionId(checkStatus), m_address);

        } else {
            Terminal.input(tvm.functionId(savePublicKey),"Wrong public key. Try again!\nPlease enter your public key",false);
        }
    }

    function checkStatus(int8 acc_type) public {
        if (acc_type == 1) { // acc is active and  contract is already deployed
            _getStat(tvm.functionId(setStat));

        } else if (acc_type == -1)  { // acc is inactive
            Terminal.print(0, "You don't have a Shoplist yet, so a new contract with an initial balance of 0.2 tokens will be deployed");
            AddressInput.get(tvm.functionId(creditAccount),"Select a wallet for payment. We will ask you to sign two transactions");

        } else  if (acc_type == 0) { // acc is uninitialized
            Terminal.print(0, format(
                "Deploying new contract. If an error occurs, check if your ShopList contract has enough tokens on its balance"
            ));
            deploy();

        } else if (acc_type == 2) {  // acc is frozen
            Terminal.print(0, format("Can not continue: account {} is frozen", m_address));
        }
    } 

    function _getStat(uint32 answerId) internal view {
        optional(uint256) none;
        ShopInter(m_address).getStat{
            abiVer: 2,
            extMsg: true,
            sign: false,
            pubkey: none,
            time: uint64(now),
            expire: 0,
            callbackId: answerId,
            onErrorId: 0
        }();
    }

    function setStat(ShopInter.Stat stat) public {
        m_stat = stat;
        _menu();
    }


    function _menu() virtual internal;
    
    function deploy() internal view {
            TvmCell image = tvm.insertPubkey(m_todoStateInit, m_masterPubKey);
            optional(uint256) none;
            TvmCell deployMsg = tvm.buildExtMsg({
                abiVer: 2,
                dest: m_address,
                callbackId: tvm.functionId(onSuccess),
                onErrorId:  tvm.functionId(onErrorRepeatDeploy),    // Just repeat if something went wrong
                time: 0,
                expire: 0,
                sign: true,
                pubkey: none,
                stateInit: image,
                call: {HasConstructorWithPubKey, m_masterPubKey}
            });
            tvm.sendrawmsg(deployMsg, 1);
    }

    function onSuccess() public view {
        _getStat(tvm.functionId(setStat));
    }

    function onErrorRepeatDeploy(uint32 sdkError, uint32 exitCode) public view {
        // TODO: check errors if needed.
        sdkError;
        exitCode;
        deploy();
    }    

     function creditAccount(address value) public {
        m_msigAddress = value;
        optional(uint256) pubkey = 0;
        TvmCell empty;
        Transactable(m_msigAddress).sendTransaction{
            abiVer: 2,
            extMsg: true,
            sign: true,
            pubkey: pubkey,
            time: uint64(now),
            expire: 0,
            callbackId: tvm.functionId(waitBeforeDeploy),
            onErrorId: tvm.functionId(onErrorRepeatCredit)  // Just repeat if something went wrong
        }(m_address, INITIAL_BALANCE, false, 3, empty);
    }

    function waitBeforeDeploy() public  {
        Sdk.getAccountType(tvm.functionId(checkIfStatusIs0), m_address);
    }

    function checkIfStatusIs0(int8 acc_type) public {
        if (acc_type ==  0) {
            deploy();
        } else {
            waitBeforeDeploy();
        }
    }          

     function onErrorRepeatCredit(uint32 sdkError, uint32 exitCode) public {
        // TODO: check errors if needed.
        sdkError;
        exitCode;
        creditAccount(m_msigAddress);
    }    
    
          

    function setTodoCode(TvmCell code, TvmCell data) public {
        require(msg.pubkey() == tvm.pubkey(), 101);
        tvm.accept();
        m_todoCode = code;
        m_todoData = data;

        m_todoStateInit = tvm.buildStateInit(m_todoCode, m_todoData);
    }
    
    function onError(uint32 sdkError, uint32 exitCode) public {
        Terminal.print(0, format("Operation failed. sdkError {}, exitCode {}", sdkError, exitCode));
        _menu();
    }


}
