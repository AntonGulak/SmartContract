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


abstract contract create {
    
    ShopInter.Purchase internal inputPur;
    address m_msigAddress;

    function createPurchase(uint32 index) public {
        index = index;
        Terminal.input(tvm.functionId(getAmountPurchase), "Enter product name:", false);
    }

    function getAmountPurchase(string value) public {
        inputPur.title = value;
        Terminal.input(tvm.functionId(createPurchase_), "Enter amount:", false);
    }

    function createPurchase_(string value) public {
        (uint256 amount, ) = stoi(value);
        inputPur.amount = uint32(amount);

        optional(uint256) pubkey = 0;
        ShopInter(m_msigAddress).createPurchase{
                abiVer: 2,
                extMsg: true,
                sign: true,
                pubkey: pubkey,
                time: uint64(now),
                expire: 0,
                callbackId: tvm.functionId(initializationDebot.onSuccess),
                onErrorId: tvm.functionId(initializationDebot.onError)
     
            }(inputPur.title, inputPur.amount);
    }
}