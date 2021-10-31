
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
 

contract test {


    int public HP;
    int public defend;
    address public attacker; 

    function getHP () public virtual returns (int)  {
        tvm.accept();
        HP = 10;

        return HP;
    }

     function getHP2 () public  returns (int)  {
        tvm.accept();

        return HP;
    }

}