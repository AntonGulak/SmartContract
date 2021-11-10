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



abstract contract create  {
    
    ShopInter.Purchase inputCreatePurchase;
    address destCreatePurchase;

    
    function createPurchase_(address inp) public{
        destCreatePurchase = inp;
        
        Terminal.input(tvm.functionId(getAmountPurchase), "Enter product name:", false);}

    function getAmountPurchase(string value) public {
        inputCreatePurchase.title = value;
        Terminal.input(tvm.functionId(createPurchase__), "Enter amount:", false);
    }

    function createPurchase__(string value) public {
        (uint256 amount, bool flag) = stoi(value);

        inputCreatePurchase.amount = uint32(amount);
        optional(uint256) pubkey = 0;

        if (!flag) {
            Terminal.input(tvm.functionId(createPurchase__), "Please, enter the correct amount:", false);
            
        } else 

       { 
            ShopInter(destCreatePurchase).createPurchase{
                    abiVer: 2,
                    extMsg: true,
                    sign: true,
                    pubkey: pubkey,
                    time: uint64(now),
                    expire: 0,
                    callbackId: tvm.functionId(initializationDebot.onSuccess),
                    onErrorId: tvm.functionId(initializationDebot.onError)
            
                }(inputCreatePurchase.title, inputCreatePurchase.amount);
        } //end else
    } //end createPurchase__
    
} //end contract