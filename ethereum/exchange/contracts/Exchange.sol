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

    mapping (address => address) public referrals;
    mapping (address => TokenOffer) public tokenOfferByUsers;

    address[] public currentSellers;
    TokenAndRound public tokenAndRound;

    uint256 public totalSales;
    uint256 public tokenPrice;
    uint256 constant public roundTime = 3 days;

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
        tokenAndRound.startTime = uint96(block.timestamp) | 1;
        IERC20(_tokenAndRound.addr).burn( 
            IERC20(_tokenAndRound.addr).balanceOf(address(this))
        );
    }
     function startSaleRound() external {
        TokenAndRound memory _tokenAndRound = tokenAndRound;
        require(uint96(block.timestamp) - _tokenAndRound.startTime > roundTime, 
                "A round isn't finished"
        );
        require(totalSales > 0, 
                "You should start the trade round"
        );
        tokenAndRound.startTime = uint96(block.timestamp) + (uint96(block.timestamp) & 1);
        tokenPrice = (tokenPrice * 103) / 100 + 4 * 10**12;
        totalSales = 0;

        IERC20(_tokenAndRound.addr).mint(address(this), totalSales / tokenPrice);

        address[] memory _currentSellers = currentSellers;
        for(uint i = 0; i < _currentSellers.length; i++) {
            IERC20(_tokenAndRound.addr).transfer(_currentSellers[i], 
                                                tokenOfferByUsers[_currentSellers[i]].amount
            );
            delete tokenOfferByUsers[_currentSellers[i]];
        }
        delete currentSellers;
    }

      function buyTokenOnSaleRound() external payable nonReentrant {
        TokenAndRound memory _tokenAndRound = tokenAndRound;
        require(uint96(block.timestamp) - _tokenAndRound.startTime < roundTime, 
                "A sale round is finished"
        );
        require(_tokenAndRound.startTime % 2 == 0, 
                "It is not a sale round"
        );
        uint256 _tokenPrice = tokenPrice;
        uint256 _amountTokens = msg.value / _tokenPrice;
        uint256 _trueValue = _tokenPrice * _amountTokens;
        
        IERC20(_tokenAndRound.addr).transfer(msg.sender, _amountTokens);
        sendToReferals(msg.sender, _trueValue, 50, 30);
    }

    function buyTokenOnTradeRound(address payable _seller, uint256 _price) external payable nonReentrant {
        TokenAndRound memory _tokenAndRound = tokenAndRound;
        TokenOffer memory _tokenOffer = tokenOfferByUsers[_seller];
        require(uint96(block.timestamp) - _tokenAndRound.startTime < roundTime, 
                "A trade round is finished"
        );
        require(_tokenAndRound.startTime % 2 == 1, 
                "It is not a trade round"
        );
        require(_price == _tokenOffer.price, 
                "The price is changed"
        );
        uint256 _amountTokens = msg.value / _tokenOffer.price;
        tokenOfferByUsers[_seller].amount -= _amountTokens;
        totalSales += _amountTokens;
        uint256 _trueValue = _amountTokens * _tokenOffer.price;

        IERC20(_tokenAndRound.addr).transfer(msg.sender, _amountTokens);
        sendToReferals(msg.sender, _trueValue, 25, 25);
        _seller.call{
                value: (_trueValue * 95) / 100
        }("");
        
    } 

    function placeTokens(uint256 _amount, uint256 _price) external  {
        require(tokenAndRound.startTime % 2 == 1, 
                "It is not a trade round"
        );
        require(_amount > 0 && _price > 0, 
                "Incorrect values"
        );
        IERC20(tokenAndRound.addr).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        if (tokenOfferByUsers[msg.sender].price == 0) {
            currentSellers.push(msg.sender);
        }
        tokenOfferByUsers[msg.sender].amount += _amount;
        tokenOfferByUsers[msg.sender].price = _price;
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
        require(referrals[msg.sender] == address(0), 
                "You are already registered"
        );
        referrals[msg.sender] = inviter;
    }

    function registerTokenFactory(address _tokenFactory, uint256 _amount, uint256 _initCost) external onlyAdmin {
        require(tokenAndRound.startTime == 0, 
                "Token factory are already registered"
        );
        tokenAndRound.addr = _tokenFactory;
        IERC20(_tokenFactory).mint(address(this), _amount);
        tokenPrice = _initCost / _amount;
        tokenAndRound.startTime = uint96(block.timestamp) + (uint96(block.timestamp) & 1);
    }

    function withdrawByAdmin(address payable _destination) external onlyAdmin {
        (bool success,) = _destination.call{value: address(this).balance}("");
        require(success, "Failed to send money");
    }

    function sendToReferals(address _buyer, uint256 _summ, uint256 _commission1, uint256 _commission2) internal {
        address _firstRefferal = referrals[_buyer];
        if (_firstRefferal != address(0)) {
            _firstRefferal.call{
                value: (_summ * _commission1) / 1000
            }("Percentage of first referer");
        }
        address _secondRefferal = referrals[_firstRefferal];
        if (_secondRefferal != address(0)) {
             _secondRefferal.call{
                value: (_summ * _commission2) / 1000
          }("Percentage of second referer");
        }
    }

    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "function only for admin"
        );
        _;
    }
}