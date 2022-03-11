
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
 
import "IIO.sol";

contract test is IIO {


    int internal HP;
    int internal defend;
    address public attacker;

    uint public tvmPubkey;
    uint public msgPubkey;

    address public msgAddress; 

    
 

    constructor() public { 
        tvm.accept();
        HP = 255;
    }

    function setDefend() public {
        tvm.accept();
        msgAddress = msg.sender;

        tvmPubkey = tvm.pubkey();
        msgPubkey = msg.pubkey();

    }



    function getHP () public view returns (int)  {

        return HP;
    }

    function set() external override{

        tvm.accept();
        tvmPubkey = tvm.pubkey();
        msgPubkey = msg.pubkey();

        setDefend();


    }


  

}