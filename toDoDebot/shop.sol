pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

abstract contract shopInter {

    uint256 m_ownerPubkey;

    modifier onlyOwner() {
        require(msg.pubkey() == m_ownerPubkey, 101);
        _;
    }

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
    
    //function createPurchase(string title, uint32 amount) virtual public ;
    //function updatePurchase(uint32 id, bool _isSoldOut, uint32 _cost) virtual public;
    //function deletePurchase(uint32 id) virtual public;
    //function getPurchases() virtual public view returns (Purchase[] purchases);
    //function getStat() virtual public view returns (Stat stat);
}