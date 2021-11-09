pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;


import "initializationDebot.sol";
import "functionMenu/createPurchase.sol";

contract fillShipLIstDebot is initializationDebot, create {

    ShopInter.Purchase private inputPur;

    function _menu()  internal override {
        string sep = '----------------------------------------';
        Menu.select(statToString(),
         sep, 
         [
            MenuItem("Add new product", "", tvm.functionId(createPurchase)),
            MenuItem("Show shopList", "", tvm.functionId(getPurchases)),
            MenuItem("Delete product", "", tvm.functionId(deletePurchase))

        ]);
        
    } //end menu


    
     function getPurchases(uint32 index) public view {
        index = index;
        optional(uint256) none;

        ShopInter(m_address).getPurchases{
            abiVer: 2,
            extMsg: true,
            sign: false,
            pubkey: none,
            time: uint64(now),
            expire: 0,
            callbackId: tvm.functionId(getPurchases_),
            onErrorId: 0
        }();
     }

    function getPurchases_ (ShopInter.Purchase[] purchases) public {
        uint32 i;
        if (purchases.length > 0 ) {
            Terminal.print(0, "Your shopList:");
            for (i = 0; i < purchases.length; i++) {
                ShopInter.Purchase purchas = purchases[i];
                string completed;

                if (purchas.isSoldOut) {
                    completed = '✓';
                } else {
                    completed = ' ';
                }
                Terminal.print(0, format("id: {} | {}  \"{}\"  at {}, amount: {}, the total cost:  {}", purchas.id, completed, purchas.title, purchas.createdAt, purchas.amount, purchas.cost));
            }
        } else {
            Terminal.print(0, "Your shopList is empty");
        }
        _menu();
    }

    function deletePurchase(uint32 index) public {
        index = index;
        if (m_stat.completeCount + m_stat.incompleteCount > 0) {
            Terminal.input(tvm.functionId(deletePurchase_), "Enter task number:", false);
        } else {
            Terminal.print(0, "Sorry, you have no tasks to delete");
            _menu();
        }
    }

    function deletePurchase_(string value) public view {
        (uint256 num,) = stoi(value);
        optional(uint256) pubkey = 0;
        ShopInter(m_address).deletePurchase{
                abiVer: 2,
                extMsg: true,
                sign: true,
                pubkey: pubkey,
                time: uint64(now),
                expire: 0,
                callbackId: tvm.functionId(onSuccess),
                onErrorId: tvm.functionId(onError)
            }(uint32(num));
    }

} //end contract