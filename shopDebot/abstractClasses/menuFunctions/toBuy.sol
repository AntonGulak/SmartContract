pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "../../libraries/Debot.sol";
import "../../libraries/Terminal.sol";
import "../../libraries/Menu.sol";
import "../../libraries/AddressInput.sol";
import "../../libraries/ConfirmInput.sol";
import "../../libraries/Upgradable.sol";
import "../../libraries/Sdk.sol";

import "../../interfaces/shop.sol";

import "../initializationDebot.sol";



abstract contract toBuy  {
    
    ShopInter.Purchase inputToBuy;
    address destToBuy;

    
    function toBuy_(address inp) public {
        destToBuy = inp;


        Terminal.input(tvm.functionId(toBuyGetFlag), "Enter product number:", false);
    }

    function toBuyGetFlag(string value) public {
        (uint256 num,) = stoi(value);
        inputToBuy.id = uint32(num);
        ConfirmInput.get(tvm.functionId(toBuyGetCost),"Is this purchase completed?");
    }

    function toBuyGetCost(bool value) public {
        inputToBuy.isSoldOut = value;

        // if (!inputToBuy.isSoldOut) {
        //     Terminal.print(tvm.functionId(initializationDebot.onError), "You didn't buy this product, you can't enter the price");
        // }
               
        Terminal.input(tvm.functionId(updatePurchase__), "Enter total purchase price:", false);
    } 

    function updatePurchase__(string value) public {
        optional(uint256) pubkey = 0;
        (uint256 num, bool flag) = stoi(value);
        inputToBuy.cost = uint(num);


        if (!flag) {
            Terminal.input(tvm.functionId(updatePurchase__), "Please, enter the correct price:", false);
        
        } else { 

            ShopInter(destToBuy).updatePurchase{
            abiVer: 2,
            extMsg: true,
            sign: true,
            pubkey: pubkey,
            time: uint64(now),
            expire: 0,
            callbackId: tvm.functionId(initializationDebot.onSuccess),
            onErrorId: tvm.functionId(initializationDebot.onError)
                }(inputToBuy.id, inputToBuy.isSoldOut, inputToBuy.cost);
                } //end else
    }  //end updatePurchase__

    

    
} //end contract