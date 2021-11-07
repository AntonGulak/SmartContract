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

contract initializationDebot is Debot, Upgradable {

    bytes m_icon;

    TvmCell m_todoCode;
    TvmCell m_todoStateInit;
    TvmCell m_todoData;
    address m_address;  
    ShopInter.Stat m_stat;
    uint32 m_taskId;
    uint256 m_masterPubKey;
    address m_msigAddress;

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

    function start() public override {
        Terminal.input(tvm.functionId(savePublicKey),"Please enter your public key",false);
    }


}
