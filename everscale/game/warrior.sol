
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "militaryUnit.sol";

contract warrior is militaryUnit {

    constructor(AdittionInterface dest) militaryUnit(dest) public { 
        HP = 10;
        attackPower = 2;
    
    }
 




}