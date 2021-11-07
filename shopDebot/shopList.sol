pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

import "shop.sol";

contract shopList is ShopInter, HasConstructorWithPubKey{
    
    uint256 public m_ownerPubkey;
    uint32 m_count;

    mapping(uint32 => Purchase) m_purchases;

    modifier onlyOwner() {
        require(msg.pubkey() == m_ownerPubkey, 101);
        _;
    }   

    constructor(uint256 pubkey) HasConstructorWithPubKey(pubkey) public {
        require(pubkey != 0, 120);
        tvm.accept();

        m_ownerPubkey = pubkey;
    }

    function createPurchase(string title, uint32 amount) public onlyOwner override {
        tvm.accept();

        m_purchases[m_count++] = Purchase(m_count, title, amount, now, false, 0);
    }

    function updatePurchase(uint32 id, bool _isSoldOut, uint32 _cost) public onlyOwner override {
        optional(Purchase) purchase = m_purchases.fetch(id);
        require(purchase.hasValue(), 102);
        tvm.accept();

        Purchase thisPurchase = purchase.get();
        thisPurchase.isSoldOut = _isSoldOut;
        thisPurchase.cost = _cost;
        m_purchases[id] = thisPurchase;
    }

    function deletePurchase(uint32 id) public onlyOwner override {
        require(m_purchases.exists(id), 102);
        tvm.accept();

        delete m_purchases[id];
    }


    function getPurchases() public view  override returns (Purchase[] purchases) {
        string title;
        uint32 amount;
        uint64 createdAt;
        bool isSoldOut;
        uint cost;

        for((uint32 id, Purchase purchase) : m_purchases) {
            
            title = purchase.title;
            amount = purchase.amount;
            createdAt = purchase.createdAt;
            isSoldOut = purchase.isSoldOut;
            cost = purchase.cost;

            purchases.push(Purchase(id, title, amount, createdAt, isSoldOut, cost));
       }
    }

    function getStat() public view  override returns (Stat stat) {
        uint32 completeCount;
        uint32 incompleteCount;
        uint amountPrice;

        for((, Purchase purchase) : m_purchases) {
            amountPrice += purchase.cost;
            if  (purchase.isSoldOut) {
                completeCount += purchase.amount;
            } else {
                incompleteCount  += purchase.amount;
            }
        }
        stat = Stat( completeCount, incompleteCount, amountPrice );
    }


} //endContract

