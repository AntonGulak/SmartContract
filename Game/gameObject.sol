
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

        require(HP > 0);
        HP = 5;
    }

    function setDefend(int value) internal   checkOwner() {
        defend = defend + value;
    }


    function toAttack(int value) virtual external override {
        tvm.accept();

        attacker = msg.sender;
        HP = HP - (value - defend);
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