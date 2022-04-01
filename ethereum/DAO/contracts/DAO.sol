pragma solidity >= 0.8.11;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DAO is AccessControl {

    struct ProposalCurrentInfo {
        uint248 accepted;
        uint248 rejected;
        bool isActivated;
    }
    struct TokenAddrWithMinQuor {
        address tokensAddress;
        uint96 minQuorumPercentage;
    }

    bytes32 public constant CHAIRMAN_ROLE = keccak256("CHAIRMAN_ROLE");
    
    mapping (bytes32 => ProposalCurrentInfo) public proposalInfo;
    mapping (address => uint256) public lastVotingTime;
    mapping (address => uint248) public depositBalance;

    TokenAddrWithMinQuor public tokenAddrWithMinQuor;
    uint256 public totalSupply;
    uint256 public voitingTime;

    constructor(
        address _tokensAddress,
        uint256 _voitingTime,
        uint96 _minQuorumPercentage
    ) public {
        require(_minQuorumPercentage <  100,
                "percentage must be less than 100");
        tokenAddrWithMinQuor = TokenAddrWithMinQuor (
            _tokensAddress,
            _minQuorumPercentage
        );
        voitingTime = _voitingTime;
        _setupRole(CHAIRMAN_ROLE, msg.sender);
    }

    function deposit(uint248 _amount) external {
        address _tokenAddress = tokenAddrWithMinQuor.tokensAddress; 
        require(IERC20(_tokenAddress).balanceOf(msg.sender) >=  _amount, 
                "error balance"
        );
        require(IERC20(_tokenAddress).allowance(msg.sender, address(this)) >=  _amount,
                "error approve"
        );

        IERC20(_tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        depositBalance[msg.sender] += _amount;
        totalSupply += _amount;
    }

    function withdrawDeposit() external {
        uint256 _depositBalance = depositBalance[msg.sender];
        require(_depositBalance >  0,
                "you don`t have tokens on balance"
        );
        require(block.timestamp - lastVotingTime[msg.sender] > voitingTime,
                "you don`t have rights to withdraw deposit"
        );
        IERC20(tokenAddrWithMinQuor.tokensAddress).transfer(msg.sender, _depositBalance);
        totalSupply -= depositBalance[msg.sender];
        depositBalance[msg.sender] = 0;
    }

     function addProposal(address recipient, bytes memory signature, string memory description) external {
        require(hasRole(CHAIRMAN_ROLE, msg.sender),
                "Only for chairman"
        );
        bytes32 proposalHash = keccak256(
            abi.encodePacked(
             recipient,
             signature,
             block.timestamp)
        );
        proposalInfo[proposalHash] = ProposalCurrentInfo(0, 0, true);
        emit AddProposal(recipient, signature, block.timestamp, description);
    }

    function accept(address recipient, bytes memory signature, uint256 createTime) external {
        require(block.timestamp - createTime < voitingTime,
                "Proposal is finished"
        );   
        bytes32 proposalHash = keccak256(
            abi.encodePacked(
             recipient,
             signature,
             createTime)
        );
        lastVotingTime[msg.sender] += block.timestamp + voitingTime;
        proposalInfo[proposalHash].accepted += depositBalance[msg.sender];
        emit Accept(recipient, signature, createTime, msg.sender);
    }

    function reject(address recipient, bytes memory signature, uint256 createTime) external {
        require(block.timestamp - createTime < voitingTime,
                "Proposal is finished"
        );   
        bytes32 proposalHash = keccak256(
            abi.encodePacked(
             recipient,
             signature,
             createTime)
        );
        lastVotingTime[msg.sender] += block.timestamp + voitingTime;
        proposalInfo[proposalHash].rejected += depositBalance[msg.sender];
        emit Reject(recipient, signature, createTime, msg.sender);
    }

    function finishProposal(address recipient, bytes memory signature, uint256 createTime) external {
        require(block.timestamp - createTime > voitingTime,
                "proposal isn't finished"
        );
        bytes32 proposalHash = keccak256(
            abi.encodePacked(
             recipient,
             signature,
             createTime)
        );

        ProposalCurrentInfo memory _proposalInfo = proposalInfo[proposalHash];
        uint256 votesSumm = _proposalInfo.accepted + _proposalInfo.rejected;
        uint256 _totalSupply = totalSupply;

        require(_proposalInfo.isActivated,
                "proposal isn't activated"
        );
        proposalInfo[proposalHash].isActivated = false;

        require(tokenAddrWithMinQuor.minQuorumPercentage < votesSumm / _totalSupply,
                "minimum quorum is not reached"
        );
        uint256 remainder = votesSumm - (votesSumm / _totalSupply) * _totalSupply;
        if (votesSumm / _totalSupply + remainder >= 51) {
            callBySignature(recipient, signature);
        }
    }

    function callBySignature(address recipient, bytes memory signature) internal { 
        (bool success, ) = recipient.call{value: 0}(
                    signature
             );
        require(success, "ERROR call func");
    }

    event AddProposal(
        address indexed recipient,
        bytes signature,
        uint256 createTime,
        string description
    );

    event Accept(
        address indexed recipient,
        bytes signature,
        uint256 createTime,
        address voter
    );

    event Reject(
        address indexed recipient,
        bytes signature,
        uint256 createTime,
        address voter
    );
}