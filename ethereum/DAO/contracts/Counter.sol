pragma solidity >= 0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract Counter is AccessControl {


    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");
    uint256 public counter;
 

    constructor(
        address addressDAO
    ) public {
        _setupRole(DAO_ROLE, addressDAO);
    }

    function addCount(uint256 val) external {
    
        require(
            hasRole(DAO_ROLE, msg.sender),
            "Only for DAO"
        );

        counter += val;
    }

}