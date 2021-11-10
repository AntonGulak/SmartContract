pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;



contract Todo {
     string public value;
     uint256 public amount;
     bool public flag;


    function setValue() public {
        tvm.accept();
         value = "123";
         }
         


    function getStat() public  {
        tvm.accept();
        (amount, flag ) = stoi(value);
    }

}

