
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
 

contract test {


    int internal HP;
    int internal defend;
    address public attacker; 

    constructor() public { 
        tvm.accept();
        HP = 5;
    }


    function getHP () public view returns (int)  {

        return HP;
    }

    function set() external {
        HP = 7;
    }

  

}