pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract TokenERC1155 is AccessControl, ERC1155 {

    string public name;
    string public symbol;

    constructor(string memory _name, string memory _symbol, string memory baseURI) 
            public ERC1155(baseURI) {

         _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        name = _name;
        symbol = _symbol;
    }

    function mint(uint256 id, uint256 amount) public onlyAdmin {
        _mint(msg.sender, id, amount, "");
    }

     function burn(uint256 id, uint256 amount) external {
        _burn(msg.sender, id, amount);
    }

    
    function uri(uint256 _id) override public view returns (string memory) {
    return string(
        abi.encodePacked(
            super.uri(0),
            Strings.toString(_id),
            ".json"
            )
        );
    }

    function supportsInterface(bytes4 interfaceId) public 
             view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "function only for admin"
        );
        _;
    }

}