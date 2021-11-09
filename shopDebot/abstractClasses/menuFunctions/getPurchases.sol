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



abstract contract get {
    
    ShopInter.Purchase inputGetPurchases;
    address destGetPurchases;

    
    function getPurchases_(address inp) public {
        
        destGetPurchases = inp;
        
        optional(uint256) none;

        ShopInter(destGetPurchases).getPurchases{
            abiVer: 2,
            extMsg: true,
            sign: false,
            pubkey: none,
            time: uint64(now),
            expire: 0,
            callbackId: tvm.functionId(getPurchases__),
            onErrorId: 0
        }();
     }

    function getPurchases__ (ShopInter.Purchase[] purchases) public {
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
            Terminal.print(0, format("id: {} | {}  \"{}\"  at {}, amount: {}, the total cost:  {}", purchas.id, completed, purchas.title, purchas.createdAt, purchas.amount, purchas.cost));
        }
      
        initializationDebot.onSuccess;
    }
    
}