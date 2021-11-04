pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "test.sol";

contract next is test {

    int internal value = 155;

    function doit(address dest) public  {
        tvm.accept();

        IIO(dest).set(); 
 
    }


}