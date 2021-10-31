
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";

contract militaryUnit is gameObject {
    address private baseStat;

    constructor(IIO baseStation) public { 
        require(tvm.pubkey() != 0, 101);
        tvm.accept();

        baseStation.CallParentContract(0);
        
        baseStat = baseStation;

    }


    


}