pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

// This is class that describes you smart contract.
contract token {

   // Структура токена (представим, что это картина, имеющее своё название, автора и год)
    struct Token {
        string name;
        string nameAuthor;
        uint year;
    }

    // Структура информации о токене с обратной связкой с массивом
    struct inf {
        uint owner;
        uint price;
        uint index;
    }


// Массив токенов, чтобы там хранить все токены
Token [] tokenArr;

// Привязываем токен к конкретному владельцу
 mapping (string => inf) tokenToOwner;
 

// Создаем новый токен, добавляем его в массив токенов
// и привязываем к нему адрес  владельца msg.pubkey()
    function createToken(string name, string nameAuthor, uint year) public {
        tvm.accept();
        require(tokenToOwner.exists(name) == false, 100, "Name already in use. Please choose another one.");

        tokenArr.push(Token(name, nameAuthor, year));
        tokenToOwner[name] = inf(msg.pubkey(), 0, tokenArr.length - 1);
    }


// Получаем адрес владельца по имени токена
    function getTokenOwner(string name) public checkToken(name) view returns (uint) {
        return tokenToOwner[name].owner;
    }

 // Получаем стоимость  по имени токена
    function getTokenPrice(string name) public checkToken(name) view returns (uint) {
        return tokenToOwner[name].price;
    }   


// Получить  информацию о токене (автор, год) по его имени
    function getTokenInfo(string name) public checkToken(name) view returns (string tokennameAuthor, uint tokenYear) {
        tokennameAuthor = tokenArr[tokenToOwner[name].index].nameAuthor;
        tokenYear = tokenArr[tokenToOwner[name].index].year;
    }

// Сменить владельца с проверкой совпадения его адреса с адресом меняемого токена
    function changeOwner(string name, uint pubkeyOfNewOwner) public checkOwner(name) {

        tokenToOwner[name].owner = pubkeyOfNewOwner;
    }

 // Выставить цену токена
    function changePrice(string name, uint amount) public checkOwner(name) {

        tokenToOwner[name].price = amount;
    }
   

	modifier checkOwner(string name) {
		// Check that message was signed with contracts key.
		require(msg.pubkey() == tokenToOwner[name].owner, 101);
		tvm.accept();
		_;
	}

    modifier checkToken(string name) {
		require(tokenToOwner.exists(name) == true, 100, "Non-existent token");
        _;
	}

    constructor() public {
        require(tvm.pubkey() != 0, 100);
        require(msg.pubkey() == tvm.pubkey(), 102);
        tvm.accept();
    }

}
