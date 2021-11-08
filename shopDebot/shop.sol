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
        uint256 id;
        string title;
        uint256 amount;
        uint256 createdAt;
        bool isSoldOut;
        uint256 cost;
    }

    struct Stat {
        uint256 completeCount;
        uint256 incompleteCount;
        uint256 amountPrice;
    }
    
    function createPurchase(string title, uint32 amount)  external ;
    function updatePurchase(uint256 id, bool _isSoldOut, uint256 _cost) external;
    function deletePurchase(uint256 id) external;
    function getPurchases() external view returns (Purchase[] purchases);
    function getStat() external view returns (Stat stat);
}