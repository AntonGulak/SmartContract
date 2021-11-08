pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "shop.sol";

contract shopList is ShopInter, HasConstructorWithPubKey{
    
    uint256 public m_ownerPubkey;
    uint256 m_count;

    mapping(uint256 => Purchase) m_purchases;

    modifier onlyOwner() {
        require(msg.pubkey() == m_ownerPubkey, 101);
        _;
    }   

    constructor(uint256 pubkey) HasConstructorWithPubKey(pubkey) public {
        require(pubkey != 0, 120);
        tvm.accept();

        m_ownerPubkey = pubkey;
    }

    function createPurchase(string title, uint32 amount) public override {
        tvm.accept()
        ;
        m_count++;
        m_purchases[m_count] = Purchase(m_count, title, amount, now, false, 0);
    }

    function updatePurchase(uint256 id, bool _isSoldOut, uint256 _cost) public onlyOwner override {
        optional(Purchase) purchase = m_purchases.fetch(id);
        require(purchase.hasValue(), 102);
        tvm.accept();

        Purchase thisPurchase = purchase.get();
        thisPurchase.isSoldOut = _isSoldOut;
        thisPurchase.cost = _cost;
        m_purchases[id] = thisPurchase;
    }

    function deletePurchase(uint256 id) public onlyOwner override {
        require(m_purchases.exists(id), 102);
        tvm.accept();

        delete m_purchases[id];
    }


    function getPurchases() public view  override returns (Purchase[] purchases) {
        string title;
        uint256 amount;
        uint256 createdAt;
        bool isSoldOut;
        uint256 cost;

        for((uint256 id, Purchase purchase) : m_purchases) {
            
            title = purchase.title;
            amount = purchase.amount;
            createdAt = purchase.createdAt;
            isSoldOut = purchase.isSoldOut;
            cost = purchase.cost;

            purchases.push(Purchase(id, title, amount, createdAt, isSoldOut, cost));
       }
    }

    function getStat() public view  override returns (Stat stat) {
        uint256 completeCount;
        uint256 incompleteCount;
        uint256 amountPrice;

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

