pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface InteractionWithTokenFactory {
    function mint(string memory metadata) external;
    function burn(uint256 tokenId) external;
}

contract MartketPlace is AccessControl {

    event TokenListing(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address indexed tokenAddr,
        bool isAuction 
    );

     struct TokenCurrentInfo {
         uint256 currentPrice;
         address lastBuyer;
         uint88 bidsCounter;
         bool onSale;
     }

    mapping (bytes32 => TokenCurrentInfo) public tokenInfo;
    
    address public exchangeERC20Token;

    constructor() {
         _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setExchangeERC20Token(address _exchangeERC20Token) external onlyAdmin {
        exchangeERC20Token = _exchangeERC20Token;
    }

    function listItem(
        uint256 id,
        uint256 initPrice,
        address tokenAddr
    ) external {
        insertTolist(id, initPrice, 0, tokenAddr, false);
    }

    function listItemOnAuction(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr
    ) external {
        insertTolist(id, initPrice, minStep, tokenAddr, true);
    }

    function insertTolist(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        bool isAuction
    ) internal {
        require(initPrice > 0, "Price must be greater than 0");
        IERC721(tokenAddr).transferFrom(msg.sender, address(this), id);
        emit TokenListing(id, initPrice, minStep, tokenAddr, isAuction);
        bytes32 tokenHash = keccak256(
            abi.encodePacked(
            id,
            initPrice,
            minStep,
            tokenAddr,
            isAuction,
            msg.sender, 
            block.timestamp)
        );
        tokenInfo[tokenHash] = TokenCurrentInfo(initPrice, address(0), 0, true);
    }

    function cancel(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        uint64 timestamp
    ) external {
        bytes32 tokenHash = keccak256(
            abi.encodePacked(
             id,
             initPrice,
             minStep,
             tokenAddr,
             false,
             msg.sender, 
             timestamp)
        );
        delete tokenInfo[tokenHash];
    }

    function buyItem(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        address owner,
        uint64 timestamp
    ) external {
        bytes32 tokenHash = keccak256(
            abi.encodePacked(
             id,
             initPrice,
             minStep,
             tokenAddr,
             false,
             owner, 
             timestamp)
        );
        require(tokenInfo[tokenHash].onSale == true,
                "You can't buy this token"
        );
        IERC20(exchangeERC20Token).transferFrom(msg.sender, owner, initPrice);
        IERC721(tokenAddr).transferFrom(address(this), msg.sender, id);
        delete tokenInfo[tokenHash];
    }
 
    function makeBid(
        uint256 amountBid,
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        address owner,
        uint64 timestamp
    ) external {
        bytes32 tokenHash = keccak256(
            abi.encodePacked(
             id,
             initPrice,
             minStep,
             tokenAddr,
             true,
             owner, 
             timestamp)
        );
        require(block.timestamp - timestamp < 2 weeks,
                "Auction is finished"
        );   
        TokenCurrentInfo memory tokenCurrentInfo = tokenInfo[tokenHash];
        require(tokenCurrentInfo.onSale == true,
                "You can't make a bid for token"
        );
        require(amountBid > tokenCurrentInfo.currentPrice + minStep,
                "You bid is small"
        );
        IERC20(exchangeERC20Token).transferFrom(msg.sender, address(this), amountBid);
        if (tokenCurrentInfo.lastBuyer != address(0)) {
            IERC20(exchangeERC20Token)
                .transferFrom(
                    address(this),
                    tokenCurrentInfo.lastBuyer,
                    tokenCurrentInfo.currentPrice
                );
        tokenInfo[tokenHash] = TokenCurrentInfo(
            amountBid,
            msg.sender,
            tokenCurrentInfo.bidsCounter + 1,
            true
        );
        }
    }   

    function finishAuction(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        address owner,
        uint64 timestamp
    ) external {
        bytes32 tokenHash = keccak256(
            abi.encodePacked(
             id,
             initPrice,
             minStep,
             tokenAddr,
             true,
             owner, 
             timestamp)
        );
        TokenCurrentInfo memory tokenCurrentInfo = tokenInfo[tokenHash];
        require(block.timestamp - timestamp > 2 weeks,
                "Auction isn`t finished"
        );   
        require(tokenCurrentInfo.bidsCounter > 2,
                "Auction cannot be finished"
        ); 
        IERC721(tokenAddr)
            .transferFrom(
                address(this),
                tokenCurrentInfo.lastBuyer,
                id
            );
        delete tokenInfo[tokenHash];
    }
 
    function cancellAuction(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        address owner,
        uint64 timestamp
    ) external {
        bytes32 tokenHash = keccak256(
            abi.encodePacked(
             id,
             initPrice,
             minStep,
             tokenAddr,
             true,
             owner, 
             timestamp)
        );
        TokenCurrentInfo memory tokenCurrentInfo = tokenInfo[tokenHash];
        require(block.timestamp - timestamp > 2 weeks,
                "Auction isn`t finished"
        );   
        require(tokenCurrentInfo.bidsCounter <= 2,
                "Auction cannot be cancelled"
        ); 
        IERC721(tokenAddr)
            .transferFrom(
                address(this),
                owner,
                id
            );
        delete tokenInfo[tokenHash];
    }

    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "function only for admin"
        );
        _;
    }
}