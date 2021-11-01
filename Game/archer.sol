
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "militaryUnit.sol";

contract archer is militaryUnit {
    
    constructor(AdittionInterface dest) militaryUnit(dest) public { 
        HP = 5;
        attackPower = 4;
    }

}