pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

import "get.sol";
import "new.sol";

contract Todo is get, bew {


    constructor() public {
        require(pubkey != 0, 120);
        tvm.accept();
        
        
    }

  

}

