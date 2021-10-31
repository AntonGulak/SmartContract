
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

interface IIO {
    
    function toAttack(int value) external; 


    modifier checkOwner() {
	  require(msg.pubkey() == tvm.pubkey(), 102);
      tvm.accept();
	  _;
	}
    
}