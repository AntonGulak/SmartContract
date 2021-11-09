pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;


import "../../abstractClasses/initializationDebot.sol";

import "../../abstractClasses/menuFunctions/create.sol";
import "../../abstractClasses/menuFunctions/toBuy.sol";
import "../../abstractClasses/menuFunctions/del.sol";




contract summaryDebot is initializationDebot, create, toBuy, del {

    function _menu()  internal override {
        string sep = '----------------------------------------';

        if (m_stat.completeCount + m_stat.incompleteCount > 0) {
             Menu.select(statToString(),
         sep, 
         [
            MenuItem("Show shopList", "", tvm.functionId(getPurchases)),
            MenuItem("Add new product", "", tvm.functionId(createPurchase)),
            MenuItem("Update purchase status ", "", tvm.functionId(toBuy)),
            MenuItem("Delete product", "", tvm.functionId(deletePurchase))
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
    
    function deletePurchase(uint32 index)  public  {
        index = index;

        deletePurchase_(m_address);
    }
         


    

} //end contract