pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;


import "../../base/Debot.sol";
import "../../base/Terminal.sol";
import "../../base/Menu.sol";
import "../../base/AddressInput.sol";
import "../../base/ConfirmInput.sol";
import "../../base/Upgradable.sol";
import "../../base/Sdk.sol";
import "../shop.sol";
import "../initializationDebot.sol";


abstract contract create {
    ShopInter.Purchase internal inputPur;

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
        ShopInter(initializationDebot(msg.sender).getAddress()).createPurchase{
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