pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

interface IERC20 {
    function mint(address _to, uint256 _value) external;
    function burn(uint256 _value) external;
    function transferFrom(address _from, address _to, uint256 _amount) external;
    function transfer(address _to, uint256 _value) external returns (bool success);
    function balanceOf(address _owner) external view returns (uint256 balance);
}

contract Exchange is AccessControl, ReentrancyGuard {

    struct TokenAndRound {
       address addr;
       uint96 startTime;
    }

    struct TokenOffer{
       uint256 amount;
       uint256 price;
    }

    TokenAndRound tokenAndRound;
    mapping (address => address) public referrals;
    mapping (address => TokenOffer) public tokenOfferByUsers;

    uint256 totalSales;
    uint256 tokenPrice;
    uint256 constant roundTime = 3 days;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function startTradeRound() external {
        TokenAndRound memory _tokenAndRound = tokenAndRound;
        require(uint96(block.timestamp) - _tokenAndRound.startTime > roundTime, 
                "A round isn't finished"
        );
        require(totalSales == 0, 
                "You should start the sale round"
        );
        uint256 currentBalance = IERC20(_tokenAndRound.addr).balanceOf(address(this));
        IERC20(_tokenAndRound.addr).burn(currentBalance);
        tokenAndRound.startTime = uint96(block.timestamp) | 1;
    }
     function startSaleRound() external {
        TokenAndRound memory _tokenAndRound = tokenAndRound;
        require(uint96(block.timestamp) - _tokenAndRound.startTime > roundTime, 
                "A round isn't finished"
        );
        require(totalSales > 0, 
                "You should start the trade round"
        );
        tokenPrice = (tokenPrice * 103) / 100 + 4 * 10**12;
        uint256 tokenAmount = totalSales / tokenPrice;
        totalSales = 0;
        IERC20(_tokenAndRound.addr).mint(address(this), tokenAmount);
        tokenAndRound.startTime = uint96(block.timestamp) + (uint96(block.timestamp) & 1);
    }

      function buyTokenOnSaleRound(uint256 amount) external payable nonReentrant {
        TokenAndRound memory _tokenAndRound = tokenAndRound;
        require(uint96(block.timestamp) - _tokenAndRound.startTime < roundTime, 
                "A sale round is finished"
        );
        require(_tokenAndRound.startTime % 2 == 0, 
                "It is not a sale round"
        );
        uint256 amountTokens = msg.value / tokenPrice;
        IERC20(_tokenAndRound.addr).transfer(msg.sender, amountTokens);
        uint256 trueValue = tokenPrice * amountTokens;
        address firstRefferal = referrals[msg.sender];
        if (firstRefferal != address(0)) {
            firstRefferal.call{
                value: (trueValue * 5) / 100
            }("Percentage of first referer");
        }
        address secondRefferal = referrals[firstRefferal];
        if (secondRefferal != address(0)) {
             secondRefferal.call{
                value: (trueValue * 3) / 100
          }("Percentage of second referer");
        }
    }

    function buyTokenOnTradeRound(address payable seller) external payable nonReentrant {
        TokenAndRound memory _tokenAndRound = tokenAndRound;
        TokenOffer memory _tokenOffer = tokenOfferByUsers[seller];

        require(uint96(block.timestamp) - _tokenAndRound.startTime < roundTime, 
                "A trade round is finished"
        );
        require(_tokenAndRound.startTime % 2 == 1, 
                "It is not a trade round"
        );
        uint256 amountTokens = msg.value / _tokenOffer.price;
        if(_tokenOffer.amount > amountTokens) {
            amountTokens = _tokenOffer.amount;
        }
        tokenOfferByUsers[seller].amount -= amountTokens;
        uint256 trueValue = amountTokens * _tokenOffer.price;
        IERC20(_tokenAndRound.addr).transfer(msg.sender, amountTokens);
        seller.call{
                value: (trueValue * 95) / 100
        }("");
        
        address firstRefferal = referrals[seller];
        if (firstRefferal != address(0)) {
            firstRefferal.call{
                value: (msg.value * 25) / 1000
            }("Percentage of first referer");
        }
        address secondRefferal = referrals[firstRefferal];
        if (secondRefferal != address(0)) {
             secondRefferal.call{
                value: (msg.value * 25) / 1000
          }("Percentage of second referer");
        }
    } 

    function placeTokens(uint256 _amount, uint256 _price) external  {
        IERC20(tokenAndRound.addr).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        tokenOfferByUsers[msg.sender].amount += _amount;
        tokenOfferByUsers[msg.sender].price = _price;
    }

    function unplaceTokens() external {
        uint256 balance = tokenOfferByUsers[msg.sender].amount;
        tokenOfferByUsers[msg.sender] = TokenOffer(0,0);
        IERC20(tokenAndRound.addr).transfer(msg.sender, balance);
    }


    function finishSaleRoundPrematurely() external {
        require(tokenAndRound.startTime % 2 == 0, 
                "It's not the sale round"
        );
        require(IERC20(tokenAndRound.addr).balanceOf(address(this)) == 0, 
                "You can not finish the sale round"
        );

        tokenAndRound.startTime = 1;
    }


    function register(address inviter) external {
        require(referrals[msg.sender] != address(0), 
                "You are already registered"
        );
        referrals[msg.sender] = inviter;
    }

    function registerTokenFactory(address _tokenFactory) external onlyAdmin {
        require(tokenAndRound.startTime == 0, 
                "Token factory are already registered"
        );
        tokenAndRound.addr = _tokenFactory;
        mintToken(10**5);
        tokenPrice = 1 ether / 10**5;
        tokenAndRound.startTime = uint96(block.timestamp) + (uint96(block.timestamp) & 1);
    }

    function mintToken(uint256 amount) internal {
        IERC20(tokenAndRound.addr).mint(msg.sender, amount);
    }

    function burnTokens(uint256 amount) internal {
        IERC20(tokenAndRound.addr).burn(amount);
    }

    function withdrawByAdmin(address payable destination, uint256 amount) external onlyAdmin {
        (bool success,) = destination.call{value: amount}("");
        require(success, "Failed to send money");
    }

    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "function only for admin"
        );
        _;
    }
}