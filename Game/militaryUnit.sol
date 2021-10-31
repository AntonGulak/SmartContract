
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";
import "addUnit.sol";
import "deleteUnit.sol";

contract militaryUnit is gameObject, DeleteUnit {
    
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


    constructor(AddUnit baseStation, int valueAttack) virtual public { 
        require(tvm.pubkey() != 0, 101);
        tvm.accept();

        baseStation.addUnit();
        setAttackPower(valueAttack);
        
        baseStat = baseStation;

    }
 
    function Attack(IIO dest) public pure checkOwner() {
        dest.toAttack(attackPower);
    }


}