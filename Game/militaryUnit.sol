
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";
import "baseStation.sol";


contract militaryUnit is gameObject {
    
    address internal baseStat;
    int internal attackPower;

    //Проверка на то, что вызывает база
    function deleteUnit(address att) external override{
        tvm.accept();
        
        attacker = att;
        sendAllValueAndDestroyed();
    }

    function getAttackPower() public view returns (int) {
       return attackPower;
    }


    function setAttackPower(int value) internal {
        tvm.accept();
        attackPower = value;
    }


    constructor(address dest, int valueAttack) virtual public { 
        require(tvm.pubkey() != 0, 101);
        tvm.accept();

        baseStation(dest).addUnit();

        setAttackPower(valueAttack);
        
        baseStat = dest;

    }
 
    function Attack(IIO dest) public pure checkOwner() {
        dest.toAttack(attackPower);
    }


}