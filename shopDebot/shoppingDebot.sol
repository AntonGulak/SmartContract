pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;


import "initializationDebot.sol";

contract shopping is initializationDebot {

    function _menu()  internal override {
        string sep = '----------------------------------------';
        Menu.select(statToString(),
         sep, 
         [
            MenuItem("Update purchase status ", "", tvm.functionId(toBuy)),
            MenuItem("Show shopList", "", tvm.functionId(getPurchases)),
            MenuItem("Delete product", "", tvm.functionId(deletePurchase))

        ]);
        
    } //end menu

    function toBuy(uint32 index) public {
        index = index;
        if (m_stat.completeCount + m_stat.incompleteCount > 0) {
            Terminal.input(tvm.functionId(toBuyGetFlag), "Enter product number:", false);
        } else {
            Terminal.print(0, "Sorry, you have product to update");
            _menu();
        }
    }

    function toBuyGetFlag(string value) public {
        (uint256 num,) = stoi(value);
        inputPur.id = uint32(num);
        ConfirmInput.get(tvm.functionId(toBuyGetCost),"Is this purchase completed?");
    }

    function toBuyGetCost(bool value) public {
        inputPur.isSoldOut = value;
 
        Terminal.input(tvm.functionId(updatePurchase__), "Enter total purchase price:", false);
    } 
    

      function updatePurchase__(string value) public {
        optional(uint256) pubkey = 0;
        (uint256 num,) = stoi(value);
        inputPur.cost = uint(num);

        ShopInter(m_address).updatePurchase{
                abiVer: 2,
                extMsg: true,
                sign: true,
                pubkey: pubkey,
                time: uint64(now),
                expire: 0,
                callbackId: tvm.functionId(onSuccess),
                onErrorId: tvm.functionId(onError)
            }(inputPur.id, inputPur.isSoldOut, inputPur.cost);
    }  
    
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