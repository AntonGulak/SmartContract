pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;


import "initializationDebot.sol";

contract fillShipLIstDebot is initializationDebot {

    ShopInter.Purchase private inputPur;

    function _menu()  internal override {
        string sep = '----------------------------------------';
        Menu.select(statToString(),
         sep, 
         [
            MenuItem("Add new product", "", tvm.functionId(getNamePurchase))
            //MenuItem("Show shopList", "", tvm.functionId(getPurchases))
            //MenuItem("Delete product", "", tvm.functionId(deletePurchase))

        ]);
        
    } //end menu

    function getNamePurchase(uint32 index) public {
        index = index;
        Terminal.input(tvm.functionId(createPurchase_), "Enter product name:", false);
    }

    function getAmountPurchase(string value) public {
        inputPur.title = value;
        Terminal.input(tvm.functionId(createPurchase_), "Enter product name:", false);
    }

    function createPurchase_(string value) public {
        (inputPur.amount, ) = stoi(value);
     

        optional(uint256) pubkey = 0;
        ShopInter(m_address).createPurchase{
                abiVer: 2,
                extMsg: true,
                sign: true,
                pubkey: pubkey,
                time: uint64(now),
                expire: 0,
                callbackId: tvm.functionId(onSuccess),
                onErrorId: tvm.functionId(onError)
     
            }(value, 1);
    }


} //end contract