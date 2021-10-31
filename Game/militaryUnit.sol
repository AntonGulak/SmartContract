
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";
import "deleteUnit.sol";
import "adittionInterface.sol";

contract militaryUnit is gameObject, DeleteUnit {
    
    address internal baseStat;
    int internal attackPower;

    
    function deleteUnit(address att)  external override{
        tvm.accept();

        //Проверка на то, что вызывает база
        require(msg.sender == baseStat);   

        attacker = att;
        sendAllValueAndDestroyed();
    }

    function getAttackPower() public view returns (int) {
       return attackPower;
    }


    function setAttackPower(int value) internal checkOwner() {

        attackPower = value;
    }


    constructor(address baseAdress, int valueAttack)  public { 
        require(tvm.pubkey() != 0, 101);
        tvm.accept();

        baseStat = baseAdress;

        AdittionInterface(baseStat).addUnit();

        
        setAttackPower(valueAttack);
        
    }
 
    function Attack(IIO dest) public checkOwner() {
        tvm.accept();
        dest.toAttack(attackPower);
    }

    function checkDead()  internal override checkOwner()  {
        if (HP < 0) {

            sendAllValueAndDestroyed();
            AdittionInterface(baseStat).deleteUnit();
        }
    }


}