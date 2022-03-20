pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

interface IERC721 {
    function mint(address owner, string memory metadata) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract MartketPlace is AccessControl {

    struct TokenCurrentInfo {
        uint256 currentPrice;
        address lastBuyer;
        uint96 bidsCounter;
    }

    mapping (bytes32 => TokenCurrentInfo) public tokenInfo;
    
    address public exchangeERC20Token;
    address public ERC721Factory;

    constructor(address _exchangeERC20Token, address _ERC721Factory) {
         _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
         exchangeERC20Token = _exchangeERC20Token;
         ERC721Factory = _ERC721Factory;
    }

    function setExchangeERC20Token(address _exchangeERC20Token) external onlyAdmin {
        exchangeERC20Token = _exchangeERC20Token;
    }

    function setERC721Factory(address _ERC721Factory) external onlyAdmin {
        ERC721Factory = _ERC721Factory;
    }

     function getHash(
        int256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        bool isAuction,
        address owner,
        uint256 timestamp
     ) external pure returns(bytes32) {
        bytes32 tokenHash = keccak256(
            abi.encodePacked(
            id,
            initPrice,
            minStep,
            tokenAddr,
            isAuction,
            owner, 
            timestamp)
        );
        return tokenHash;
    }

    function createItem(string memory metadata, address owner) external {
        IERC721(ERC721Factory).mint(owner, metadata);
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
        tokenInfo[tokenHash] = TokenCurrentInfo(initPrice, address(0), 0);
    }

    function cancel(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        uint256 timestamp
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
        emit Cancel(id, initPrice, minStep, tokenAddr, false);
    }

    function buyItem(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        address owner,
        uint256 timestamp
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
        require(tokenInfo[tokenHash].currentPrice > 0, "Token does not exist");
        IERC20(exchangeERC20Token).transferFrom(msg.sender, owner, initPrice);
        IERC721(tokenAddr).transferFrom(address(this), msg.sender, id);
        delete tokenInfo[tokenHash];
        emit BuyItem(id, initPrice, minStep, tokenAddr, owner, false);
    }
 
    function makeBid(
        uint256 amountBid,
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        address owner,
        uint256 timestamp
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
        require(tokenCurrentInfo.currentPrice > 0, "Token does not exist");
        require(amountBid >= tokenCurrentInfo.currentPrice + minStep,
                "You bid is small"
        );
        IERC20(exchangeERC20Token).transferFrom(msg.sender, address(this), amountBid);
        tokenInfo[tokenHash] = TokenCurrentInfo(
            amountBid,
            msg.sender,
            tokenCurrentInfo.bidsCounter + 1
        );
        if (tokenCurrentInfo.lastBuyer != address(0)) {
            IERC20(exchangeERC20Token)
                .transfer(
                    tokenCurrentInfo.lastBuyer,
                    tokenCurrentInfo.currentPrice
                );
        }
        emit Bid(amountBid, id, initPrice, minStep, tokenAddr, owner, true);
    }   

    function finishAuction(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        address owner,
        uint256 timestamp
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
        require(tokenCurrentInfo.currentPrice > 0, "Token does not exist");
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
       
        IERC20(exchangeERC20Token)
            .transfer(
                owner,
                tokenCurrentInfo.currentPrice
        );

        delete tokenInfo[tokenHash];
        emit FinishAuction(id, initPrice, minStep, tokenAddr, tokenCurrentInfo.lastBuyer, owner, true);
    }
 
    function cancelAuction(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address tokenAddr,
        address owner,
        uint256 timestamp
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
        require(tokenCurrentInfo.currentPrice > 0, "Token does not exist");
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

        if (tokenCurrentInfo.lastBuyer != address(0)) {
            IERC20(exchangeERC20Token)
                .transfer(
                    tokenCurrentInfo.lastBuyer,
                    tokenCurrentInfo.currentPrice
                );
        }
        
        delete tokenInfo[tokenHash];
        emit CancelAuction(id, initPrice, minStep, tokenAddr, owner, true);
    }

    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Function only for admin"
        );
        _;
    }

    event TokenListing(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address indexed tokenAddr,
        bool isAuction
    );

    event Cancel(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address indexed tokenAddr,
        bool isAuction
    );

    event BuyItem(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address indexed tokenAddr,
        address indexed lastOwner,
        bool isAuction
    );

    event Bid(
        uint256 amountBid, 
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address indexed tokenAddr,
        address indexed currentOwner,
        bool isAuction
    );

    event FinishAuction(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address indexed tokenAddr,
        address indexed newOwner,
        address indexed lastOwner,
        bool isAuction
    );

    event CancelAuction(
        uint256 id,
        uint256 initPrice,
        uint256 minStep,
        address indexed tokenAddr,
        address indexed owner,
        bool isAuction
    );
}