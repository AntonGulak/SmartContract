
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "IIO.sol";

contract gameObject is IIO {


    int private HP;
    int private defend;
    address private attacker; 

    constructor() public { 
        require(tvm.pubkey() != 0, 101);
        tvm.accept();
        HP = 5;
    }

    function setDefend(int value) internal  checkOwner() {
        defend = value;
    }

    function getHP () public view returns (int) {
        return HP;
    }

    function getDefend () public view returns (int) {
        return defend;
    }

    function toAttack(int value) virtual external override {
        tvm.accept();

        attacker = msg.sender;

        int damage;

        if (defend > value ){ 
            damage = 0;
             }
        else {
            damage = value - defend;
        }

        HP = HP - damage;
        
        checkDead();
    }

    function checkDead() internal checkOwner()  {
        if (HP < 0) {
            sendAllValueAndDestroyed();
        }
    }

    function sendAllValueAndDestroyed() internal checkOwner() {
        attacker.transfer(1, true, 128 + 32);
    }

  

}