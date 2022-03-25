pragma solidity ^0.8.11;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

interface IERC20 {
    function mint(address _to, uint256 _value) external;
    function burn(uint256 _value) external;
    function transferFrom(address _from, address _to, uint256 _amount) external;
}

contract Bridge is AccessControl {

    mapping (address => mapping (uint256 => address)) public ERC20Tokens;
    mapping(bytes32 => bool) public transactions;

    address public nodeValidator;
    uint256 public currentBlockChainId;
    
    constructor(address _nodeValidator, uint256 _currentBlockChainId) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        nodeValidator = _nodeValidator;
        currentBlockChainId = _currentBlockChainId;
    }

    function includeToken(address tokenAddrFrom, address tokenAddTo, uint256 chainId) external onlyAdmin {
        ERC20Tokens[tokenAddrFrom][chainId] = tokenAddTo;
    }

    function excludeToken(address tokenAddrFrom, uint256 chainId) external onlyAdmin {
        ERC20Tokens[tokenAddrFrom][chainId] = address(0);
    }


    function changeNodeValidator(address _nodeValidator) external onlyAdmin {
        nodeValidator = _nodeValidator;
    }

    function mintToken(address tokenAddress, address owner, uint256 amount) internal {
        IERC20(tokenAddress).mint(owner, amount);
    }

    function burnTokens(address tokenAddress, address from, uint256 amount) internal {
        IERC20(tokenAddress).transferFrom(from, address(this), amount);
        IERC20(tokenAddress).burn(amount);
    }

    function swap(
        address tokenAddress,
        address recipient,
        uint256 amount,
        uint256 chainId,
        string memory symbol,
        uint256 nonce
    ) public returns (bytes32) {
        bytes32 msgHash = keccak256(
            abi.encodePacked(
                ERC20Tokens[tokenAddress][chainId],
                recipient,
                amount,
                chainId,
                symbol,
                nonce
            )
        );

        require(ERC20Tokens[tokenAddress][chainId] != address(0), "You cannot use this token address");
  
        burnTokens(tokenAddress, msg.sender, amount);
        emit SwapInitialized(
            ERC20Tokens[tokenAddress][chainId],
            recipient,
            amount,
            chainId,
            symbol,
            nonce
        );
        return msgHash;
    }

    function redeem(
        address tokenAddress,
        uint256 amount,
        uint256 fromChainId,
        string memory symbol,
        uint256 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(ERC20Tokens[tokenAddress][fromChainId] != address(0), "You cannot use this token address");
        bytes32 msgHash = keccak256(
            abi.encodePacked(
                tokenAddress,
                msg.sender,
                amount,
                currentBlockChainId,
                symbol,
                nonce
            )
        );
        require(!transactions[msgHash], "Transaction already implemented");
        bytes32 ethMsgHash = getHashMessage(msgHash);
        require(checkSign(ethMsgHash, v, r, s), "Invalid signature");
        transactions[msgHash] = true;
        mintToken(tokenAddress, msg.sender, amount);
    }

    function getHashMessage(bytes32 message) internal pure returns (bytes32) {
       bytes memory prefix = "\x19Ethereum Signed Message:\n32";
       return keccak256(abi.encodePacked(prefix, message));
   }

    function checkSign(
        bytes32 ethMsgHash,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal returns (bool) {
        address signerAddress = ecrecover(ethMsgHash, v, r, s);
        return signerAddress == nodeValidator;
    }

    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "function only for admin"
        );
        _;
    }

    event SwapInitialized(
        address tokenAddress,
        address recipient,
        uint256 amount,
        uint256 indexed chainId,
        string indexed symbol,
        uint256 nonce
    );
}