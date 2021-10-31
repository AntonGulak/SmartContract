
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";
import "deleteUnit.sol";
import "baseStation.sol";

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


    constructor(address baseAdress, int valueAttack)  public { 
        require(tvm.pubkey() != 0, 101);
        tvm.accept();

        baseStation(baseAdress).addUnit();

        
        setAttackPower(valueAttack);
        
        baseStat = baseAdress;

    }
 
    function Attack(IIO dest) public checkOwner() {
        tvm.accept();
        dest.toAttack(attackPower);
    }

    function checkDead() virtual internal override checkOwner()  {
        if (HP < 0) {
            sendAllValueAndDestroyed();
            baseStation(baseStat).deleteUnit();
        }
    }


}