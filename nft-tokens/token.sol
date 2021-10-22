pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

// This is class that describes you smart contract.
contract token {

   // Создаем структуру токена
    struct Token {
        string namePicture;
        string nameAuthor;
        uint year;
    }


// Массив токенов, чтобы там хранить все токены
Token [] tokenArr;
// Привязываем токен к конкретному владельцу
 mapping (uint => uint) tokenToOwner;
 

 // Привязываем стоимость к конкретному токену
 mapping (uint => uint) tokenPrice;

// Создаем новый токен, добавляем его в массив токенов
// и привязываем к нему адрес  владельца msg.pubkey()
    function createToken(string namePicture, string nameAuthor, uint year) public {
        tvm.accept();
        tokenArr.push(Token(namePicture, nameAuthor, year));
        uint keyAsLastNum = tokenArr.length - 1;
        tokenToOwner[keyAsLastNum] = msg.pubkey();
    }
// Получаем адрес владельца по номеру токена
    function getTokenOwner(uint tokenId) public view returns (uint) {
        return tokenToOwner[tokenId];
    }
// Получить  информацию о токене по его ID
    function getTokenInfo(uint tokenId) public view returns (string tokenNamePicture, string tokenNameAuthor, uint tokenYear) {
        tokenNamePicture = tokenArr[tokenId].namePicture;
        tokenNameAuthor = tokenArr[tokenId].nameAuthor;
        tokenYear = tokenArr[tokenId].year;
    }
// Сменить владельца с проверкой совпадения его адреса с адресом меняемого токена
    function changeOwner(uint tokenId, uint pubkeyOfNewOwner) public {
        tvm.accept();
        
        require(msg.pubkey() == tokenToOwner[tokenId], 101);
        tokenToOwner[tokenId] = pubkeyOfNewOwner;
    }

 // Выставить цену ткоена
    function changePrice(uint tokenId, uint Price) public {
        tvm.accept();

        require(msg.pubkey() == tokenToOwner[tokenId], 101);
        tokenPrice[tokenId] = Price;
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
