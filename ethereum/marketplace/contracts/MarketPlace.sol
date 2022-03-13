pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface InteractionWithTokenFactory {
    function mint(string memory metadata) external;
    function burn(uint256 tokenId) external;
}

contract MartketPlace is AccessControl {

    struct Item {
         uint id;
         address factoryAddress;
         uint256 tokenId;
         address payable seller;
         address payable owner;
         uint256 price;
         bool isSold;
     }

    constructor() {
         _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

}