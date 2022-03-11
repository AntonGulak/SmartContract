
pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "../libraries/Debot.sol";

abstract contract debotinfo is Debot {    
    
    bytes m_icon;

    function getDebotInfo() public functionID(0xDEB) virtual override view returns(
        string name, string version, string publisher, string key, string author,
        address support, string hello, string language, string dabi, bytes icon
    ) {
        name = "ShopList DeBot";
        version = "0.2.0";
        publisher = "";
        key = "Shop list manager";
        author = "Anton Gulak";
        support = address.makeAddrStd(0, 0x59f2168905be6fbe0295e1b7fda59ab786006c8f25e23373e82b4210016f9e47);
        hello = "Hi, i'm a ShopList DeBot.";
        language = "en";
        dabi = m_debotAbi.get();
        icon = m_icon;
    }}