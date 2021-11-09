pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;


import "../../abstractClasses/initializationDebot.sol";

import "../../abstractClasses/menuFunctions/create.sol";
import "../../abstractClasses/menuFunctions/toBuy.sol";
import "../../abstractClasses/menuFunctions/getPurchases.sol";



contract summaryDebot is initializationDebot, create, toBuy, get {

    function _menu()  internal override {
        string sep = '----------------------------------------';

        if (m_stat.completeCount + m_stat.incompleteCount > 0) {
             Menu.select(statToString(),
         sep, 
         [
            MenuItem("Add new product", "", tvm.functionId(createPurchase)),
            MenuItem("Update purchase status ", "", tvm.functionId(toBuy)),
            MenuItem("Show shopList", "", tvm.functionId(getPurchases))
            //MenuItem("Delete product", "", tvm.functionId(deletePurchase))
        ]);
        } else {
             Menu.select(statToString(),
         sep, 
         [
            MenuItem("Add new product", "", tvm.functionId(createPurchase))

        ]);
        }

        
    } //end menu

    function createPurchase(uint32 index)  public  {
        index = index;

        createPurchase_(m_address);
    }

    function toBuy(uint32 index)  public  {
        index = index;

        toBuy_(m_address);
    }
    
    
     function getPurchases(uint32 index) public {
        index = index;

        getPurchases_(m_address);

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