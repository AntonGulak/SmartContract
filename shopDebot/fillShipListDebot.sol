pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "initializationDebot.sol";

contract fillShipLIstDebot is initializationDebot {
    function _menu()  internal override {
        Terminal.print(0, "Hi, you are here");
    }
}