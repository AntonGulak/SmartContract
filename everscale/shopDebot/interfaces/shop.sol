pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

abstract contract HasConstructorWithPubKey {

   constructor(uint256 pubkey) public {}
}


interface Transactable {

   function sendTransaction(address dest, uint128 value, bool bounce, uint8 flags, TvmCell payload  ) external;
}


interface ShopInter {

    struct Purchase {
        uint32 id;
        string title;
        uint32 amount;
        uint64 createdAt;
        bool isSoldOut;
        uint cost;
    }

    struct Stat {
        uint32 completeCount;
        uint32 incompleteCount;
        uint amountPrice;
    }
    
    function createPurchase(string title, uint32 amount)  external ;
    function updatePurchase(uint32 id, bool _isSoldOut, uint _cost) external;
    function deletePurchase(uint32 id) external;
    function getPurchases() external view returns (Purchase[] purchases);
    function getStat() external view returns (Stat stat);
}