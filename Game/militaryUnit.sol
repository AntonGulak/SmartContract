
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "IIO.sol";
import "gameObject.sol";
import "deleteUnit.sol";
import "adittionInterface.sol";

contract militaryUnit is gameObject, DeleteUnit {
    
    address internal baseStat;
    int internal attackPower;

    
    function deleteUnit(address att) virtual external override{
        tvm.accept();

        //Проверка на то, что вызывает база
        //require(msg.sender == baseStat);   

        attacker = att;

        attacker.transfer(1, true, 128 + 32);
    }

    function getAttackPower() public view returns (int) {
       return attackPower;
    }


    function setAttackPower(int value) internal checkOwner() {

        attackPower = value;
    }


    constructor(address baseAdress)  public { 
        require(tvm.pubkey() != 0, 101);
        tvm.accept();

        baseStat = baseAdress;

        AdittionInterface(baseStat).addUnit();
    }
 
    function Attack(address IIOAdress) public  {
        tvm.accept();

        IIO(IIOAdress).toAttack(attackPower);
    }


    function toAttack(int value)  external override {
        tvm.accept();

        attacker = msg.sender;
        int damage;

        if (defend >= value ) {
            damage = 0;
        }
        else {
            damage = value - defend;
        } 

        HP = HP - damage;

        if (HP <= 0) {
            AdittionInterface(baseStat).deleteUnit();
            attacker.transfer(1, true, 128 + 32);  }
    }


}