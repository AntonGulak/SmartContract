pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "test.sol";

contract next {

    function doit(address dest) public  {
        tvm.accept();
 
        test called = test(dest);

        called.getHP();

    }


}