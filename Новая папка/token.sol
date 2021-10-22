pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

// This is class that describes you smart contract.
contract token {

   // Создаем структуру токена
    struct Token {
        string name;
        uint power;
    }
// Массив токенов, чтобы там хранить все токены
    Token [] tokenArr;
    // Привязываем токен к конкретному владельцу
    mapping (uint => uint) tokenToOwner;
// Создаем новый токен, добавляем его в массив токенов
// и привязываем к нему адрес владельца msg.pubkey()
    function createToken(string name, uint power) public {
        tvm.accept();
        tokenArr.push(Token(name, power));
        uint keyAsLastNum = tokenArr.length - 1;
        tokenToOwner[keyAsLastNum] = msg.pubkey();
    }
// Получаем адрес владельца по номеру токена
    function getTokenOwner(uint tokenId) public view returns (uint) {
        return tokenToOwner[tokenId];
    }
// Получить  нформацию о токене по его ID
    function getTokenInfo(uint tokenId) public view returns (string tokenName, uint tokenPower) {
        tokenName = tokenArr[tokenId].name;
        tokenPower = tokenArr[tokenId].power;
    }
// Сменить владельца с проверкой совпадения его адреса с адресом меняемого токена
    function changeOwner(uint tokenId, uint pubkeyOfNewOwner) public {
        tvm.accept();
        require(msg.pubkey() == tokenToOwner[tokenId], 101);
        tokenToOwner[tokenId] = pubkeyOfNewOwner;
    }
// Изменить часть токена
     function changePower(uint tokenId, uint power) public {
        tvm.accept();
        require(msg.pubkey() == tokenToOwner[tokenId], 101);
        tokenArr[tokenId].power = power;
    }

    constructor() public {
        // Check that contract's public key is set
        require(tvm.pubkey() != 0, 100);
        // Check that message has signature (msg.pubkey() is not zero) and
        // message is signed with the owner's private key
        require(msg.pubkey() == tvm.pubkey(), 102);
        // The current smart contract agrees to buy some gas to finish the
        // current transaction. This actions required to process external
        // messages, which bring no value (henceno gas) with themselves.
        tvm.accept();
    }

}
