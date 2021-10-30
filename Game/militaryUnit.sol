
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";

contract militaryUnit is gameObject {
    address private baseStat;

    function getAddressBase() public view returns (address) {
        return baseStat;
    }


    constructor() virtual public { 
        require(tvm.pubkey() != 0, 101);
        tvm.accept();

        baseStat = msg.sender;

    }



    


}