
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
 
import "IIO.sol";

contract test is IIO {


    int internal HP;
    int internal defend;
    address public attacker; 
 

    constructor() public { 
        tvm.accept();
        HP = 255;
    }

    function setDefend(int value) internal  checkOwner() {
       defend = value;
    }


    function getHP () public view returns (int)  {

        return HP;
    }

    function set(int value) external override{

        tvm.accept();

        attacker = msg.sender;

        int damage;

        if (defend > value ) {
            damage = 0;
        }
        else {
            damage = value - defend;
        } 
        

        HP = HP - value;

        if (HP <= 0) {
             attacker.transfer(1, true, 128 + 32);  }
    }


  

}