pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;


import "../../abstractClasses/initializationDebot.sol";
import "../../abstractClasses/functionsMenu.sol";




contract fillShipLIstDebot is  functionsMenu {

    function _menu()  internal override {
        string sep = '----------------------------------------';

        if (m_stat.completeCount + m_stat.incompleteCount > 0) {
             Menu.select(statToString(),
         sep, 
         [
            MenuItem("Show shopList", "", tvm.functionId(getPurchases)),
            MenuItem("Add new product", "", tvm.functionId(createPurchase)),
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



    

} //end contract