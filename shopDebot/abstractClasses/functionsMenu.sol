pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "../libraries/Debot.sol";
import "../libraries/Terminal.sol";
import "../libraries/Menu.sol";
import "../libraries/AddressInput.sol";
import "../libraries/ConfirmInput.sol";
import "../libraries/Upgradable.sol";
import "../libraries/Sdk.sol";

import "../interfaces/shop.sol";

import "initializationDebot.sol";



abstract contract functionsMenu is initializationDebot  {
    
    ShopInter.Purchase inputFunc;


    function createPurchase(uint32 index) public{
        index = index;
        
        Terminal.input(tvm.functionId(getAmountPurchase), "Enter product name:", false);}

    function getAmountPurchase(string value) public {
        inputFunc.title = value;
        Terminal.input(tvm.functionId(createPurchase_), "Enter amount:", false);
    }

    function createPurchase_(string value) public {
        (uint256 amount, bool flag) = stoi(value);

        inputFunc.amount = uint32(amount);
        optional(uint256) pubkey = 0;

        if (!flag || inputFunc.amount == 0) {
            Terminal.input(tvm.functionId(createPurchase_), "Please, enter the correct amount:", false);
            
        } else  { 
            ShopInter(m_address).createPurchase{
                    abiVer: 2,
                    extMsg: true,
                    sign: true,
                    pubkey: pubkey,
                    time: uint64(now),
                    expire: 0,
                    callbackId: tvm.functionId(onSuccess),
                    onErrorId: tvm.functionId(onError)
            
                }(inputFunc.title, inputFunc.amount);
        } //end else
    } //end createPurchase__

//______________________________________________________________________________________________________________________________

    
    function toBuy(uint32 index) public {
        index = index;


        Terminal.input(tvm.functionId(toBuyGetFlag), "Enter product number:", false);
    }

    function toBuyGetFlag(string value) public {
        (uint256 num,) = stoi(value);
        inputFunc.id = uint32(num);
        ConfirmInput.get(tvm.functionId(toBuyGetCost),"Is this purchase completed?");
    }

    function toBuyGetCost(bool value) public {
        inputFunc.isSoldOut = value;

        //  if (!inputToBuy.isSoldOut) {
        //      Terminal.input(tvm.functionId(initializationDebot.onErrorExternal), "You didn't buy this product, you can't enter the price. Enter any letter, if you got it", false);
        // }
               
        Terminal.input(tvm.functionId(updatePurchase_), "Enter total purchase price:", false);
    } 

    function updatePurchase_(string value) public {
        optional(uint256) pubkey = 0;
        (uint256 num, bool flag) = stoi(value);
        inputFunc.cost = uint(num);


        if (!flag) {
            Terminal.input(tvm.functionId(updatePurchase_), "Please, enter the correct price:", false);
        
        } else { 

            ShopInter(m_address).updatePurchase{
            abiVer: 2,
            extMsg: true,
            sign: true,
            pubkey: pubkey,
            time: uint64(now),
            expire: 0,
            callbackId: tvm.functionId(onSuccess),
            onErrorId: tvm.functionId(onError)
                }(inputFunc.id, inputFunc.isSoldOut, inputFunc.cost);
                } //end else
    }  //end updatePurchase__

//______________________________________________________________________________________________________________________________


    function deletePurchase(uint32 index) public {
        index = index;

        Terminal.input(tvm.functionId(deletePurchase_), "Enter task number:", false);

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


//______________________________________________________________________________________________________________________________
    function getPurchases(uint32 index) view public {

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
      
        Terminal.print(0, "Your shopList:");
        for (i = 0; i < purchases.length; i++) {
            ShopInter.Purchase purchas = purchases[i];
            string completed;

            if (purchas.isSoldOut) {
                completed = '✓';
            } else {
                completed = ' ';
            }
            Terminal.print(0, format("id: {} | {}  \"{}\"  created at {}, amount: {}, the total cost:  {}", purchas.id, completed, purchas.title, date.toString(uint(purchas.createdAt)), purchas.amount, purchas.cost));
        }

       onSuccess();
    }



    
} //end contract