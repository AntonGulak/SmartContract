pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

interface IERC20 {
    function mint(address _to, uint256 _value) external;
    function burn(uint256 _value) external;
    function transferFrom(address _from, address _to, uint256 _amount) external;
    function balanceOf(address _owner) external view returns (uint256 balance);
}

contract Exchange is AccessControl {

    uint256 constant roundTime = 3 days;

    mapping (address => address) public referrals;

    address tokenFactoryAddress;
    bool tokenFactoryIsChosen;

    uint256 totalSales;
    uint256 tokenPrice;
    uint256 roundStartTime;
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        tokenPrice = 1 ether / 10**5;
    }

    function startTradeRound() external {
        require(block.timestamp - roundStartTime > roundTime, 
                "A round isn't finished"
        );
        require(totalSales == 0, 
                "You should start the sale round"
        );
        uint256 currentBalance = IERC20(tokenFactoryAddress).balanceOf(address(this));
        IERC20(tokenFactoryAddress).burn(currentBalance);
        roundStartTime = block.timestamp;
    }
     function startSaleRound() external {
        require(block.timestamp - roundStartTime > roundTime, 
                "A round isn't finished"
        );
        require(totalSales > 0, 
                "You should start the trade round"
        );
        require(tokenFactoryIsChosen == true, 
                "You should choose token factory"
        );
        uint256 tokenAmount = totalSales / tokenPrice;
        tokenPrice = (tokenPrice * 103) / 100 + 4 * 10**12;
        totalSales = 0;
        IERC20(tokenFactoryAddress).mint(address(this), tokenAmount);
        roundStartTime = block.timestamp;
    }

    function register(address inviter) external {
        require(referrals[msg.sender] != address(0), 
                "You are already registered"
        );
        referrals[msg.sender] = inviter;
    }

    function registerTokenFactory(address _tokenFactory) external onlyAdmin {
        require(tokenFactoryIsChosen == false, 
                "Token factory are already registered"
        );
        tokenFactoryAddress = _tokenFactory;
        mintToken(10**5);
        roundStartTime = block.timestamp;
    }

    function mintToken(uint256 amount) internal {
        IERC20(tokenFactoryAddress).mint(msg.sender, amount);
    }

    function burnTokens(uint256 amount) internal {
        IERC20(tokenFactoryAddress).burn(amount);
    }

    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "function only for admin"
        );
        _;
    }
}