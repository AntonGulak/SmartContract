pragma solidity >= 0.8.11;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DAO is AccessControl {

    struct ProposalCurrentInfo {
        uint256 accepted;
        uint256 rejected;
    }

    struct TokenAddrWithMinQuor {
        address tokensAddress;
        uint96 minQuorumPercentage;
    }

    bytes32 public constant CHAIRMAN_ROLE = keccak256("CHAIRMAN_ROLE");

    mapping (address => mapping (bytes32 => bool)) public isVoited;
    mapping (address => uint256) public lastVotingTime;
    mapping (address => uint256) public depositBalance;
    mapping (bytes32 => ProposalCurrentInfo) private proposalInfo;

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

    function deposit(uint256 _amount) external {
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
                "only for chairman"
        );
        bytes32 proposalHash = keccak256(
            abi.encodePacked(
             recipient,
             signature,
             block.timestamp)
        );
        proposalInfo[proposalHash] = ProposalCurrentInfo(1, 1);
        emit AddProposal(recipient, signature, description);
    }

    function accept(address recipient, bytes memory signature, uint256 createTime) external {
        require(block.timestamp - createTime < voitingTime,
                "proposal is finished"
        );   
        bytes32 proposalHash = keccak256(
            abi.encodePacked(
             recipient,
             signature,
             createTime)
        );
        require(!isVoited[msg.sender][proposalHash],
                "you already voted"
        );
        isVoited[msg.sender][proposalHash] = true;
        lastVotingTime[msg.sender] = block.timestamp;
        proposalInfo[proposalHash].accepted += depositBalance[msg.sender];
        emit Accept(recipient, signature, createTime, msg.sender);
    }

    function reject(address recipient, bytes memory signature, uint256 createTime) external {
        require(block.timestamp - createTime < voitingTime,
                "proposal is finished"
        );   
        bytes32 proposalHash = keccak256(
            abi.encodePacked(
             recipient,
             signature,
             createTime)
        );
        require(!isVoited[msg.sender][proposalHash],
                "you already voted"
        );
        isVoited[msg.sender][proposalHash] = true;
        lastVotingTime[msg.sender] = block.timestamp;
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

        ProposalCurrentInfo memory _proposalInfo = getProposalInfo(proposalHash);
        uint256 votesSumm = _proposalInfo.accepted + _proposalInfo.rejected;
        uint256 _totalSupply = totalSupply;

        proposalInfo[proposalHash] = ProposalCurrentInfo(0,0);
        
        bool flag = true;
        if (tokenAddrWithMinQuor.minQuorumPercentage > (votesSumm / _totalSupply) * 100) {
             flag = false;
        } else if (_proposalInfo.accepted <= _proposalInfo.rejected) {
             flag = false;
        } else {
              callBySignature(recipient, signature);
        }
        emit FinishProposal(recipient, signature, createTime, flag);
    }

    function callBySignature(address recipient, bytes memory signature) internal { 
        (bool success, ) = recipient.call{value: 0}(
                    signature
             );
        require(success, "ERROR call func");
    }

     function getProposalInfo(bytes32 proposalHash) 
              public view returns(ProposalCurrentInfo memory)  {
        ProposalCurrentInfo memory _proposalInfo = proposalInfo[proposalHash];
          require(_proposalInfo.accepted > 0 && _proposalInfo.rejected > 0,
                "proposal isn't activated"
        );
        return ProposalCurrentInfo(_proposalInfo.accepted - 1, _proposalInfo.rejected - 1);
    }

    event AddProposal(
        address indexed recipient,
        bytes signature,
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

   event FinishProposal(
        address indexed recipient,
        bytes signature,
        uint256 createTime,
        bool result
    );
}