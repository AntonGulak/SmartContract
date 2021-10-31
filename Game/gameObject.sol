
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "IIO.sol";

contract gameObject is IIO {


    int HP;
    int defend;
    address attacker; 

    function getHP () public view returns (int) {
        return HP;
    }

      function setHP(int value) internal  {
        tvm.accept();

        HP = value;
    }


    function getDefend () public view returns (int) {
    return defend;
    }  

    function setDefend(int value) internal  checkOwner() {
       defend = value;
    }
 

    constructor() public { 
        require(tvm.pubkey() != 0, 101);
        tvm.accept();

        setHP(5);
    }

  
    function toAttack(int value) virtual public override {
        tvm.accept();

        attacker = msg.sender;
        int damage;

        if (defend > value ) {
            damage = 0;
        }
        else {
            damage = value - defend;
        } 

        setHP(getHP()-damage);
        
        checkDead();
    }

    function checkDead() virtual internal checkOwner()  {
        if (HP <= 0) {
            sendAllValueAndDestroyed();
        }
    }

    function sendAllValueAndDestroyed() virtual public  checkOwner() {
        attacker.transfer(1, true, 128 + 32);
    }


    modifier checkOwner() {
	  require(msg.pubkey() == tvm.pubkey(), 102);
      tvm.accept();
	  _;
	}

   
} 