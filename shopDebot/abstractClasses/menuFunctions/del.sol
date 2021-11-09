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



abstract contract del  {
    

    address destDel;

    function deletePurchase_(address inp) public {
        destDel = inp;

        Terminal.input(tvm.functionId(deletePurchase__), "Enter task number:", false);

        }

    function deletePurchase__(string value) public view {
        (uint256 num,) = stoi(value);
        optional(uint256) pubkey = 0;
        ShopInter(destDel).deletePurchase{
                abiVer: 2,
                extMsg: true,
                sign: true,
                pubkey: pubkey,
                time: uint64(now),
                expire: 0,
                callbackId: tvm.functionId(initializationDebot.onSuccess),
                onErrorId: tvm.functionId(initializationDebot.onError)
            }(uint32(num));
    }
}
