pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

contract PushArray {

	// State variable storing the sum of arguments that were passed to function 'add',
	string[] public arrayName;
	uint256 public servedCustomer = 0; 

	constructor() public {
		// check that contract's public key is set
		require(tvm.pubkey() != 0, 101);
		// Check that message has signature (msg.pubkey() is not zero) and message is signed with the owner's private key
		require(msg.pubkey() == tvm.pubkey(), 102);
		tvm.accept();
	}

 
	modifier checkOwnerAndAccept {
		// Check that message was signed with contracts key.
		require(msg.pubkey() == tvm.pubkey(), 102);
		tvm.accept();
		_;
	}

	//Добавить человека в очередь
	function addQ(string name) public checkOwnerAndAccept {
        arrayName.push(name);
	}

	//Позвать следующего
	function void_next() public checkOwnerAndAccept {
		servedCustomer += 1;
	}
	//Написать имя текущего обслуживаемого клиента
	function servedCustomerToText () public checkOwnerAndAccept returns (string) {
		// Если никаких клиентов не было - то пусто
		if (arrayName.empty()) {
			return 'Empty';
		}

		// Всех обслужили - пусто
		if (servedCustomer > arrayName.length - 1 ) {
			return 'Empty';
		}

        return arrayName[servedCustomer];
    }

}