pragma solidity >= 0.8.11;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DAO is AccessControl {

    struct ProposalCurrentInfo {
        uint256 accepted;
        uint256 rejected;
    }

    struct SettingsDAO {
        address tokensAddress;
        uint88 voitingTime;
        uint8 minQuorumPercentage;
    }

    bytes32 public constant CHAIRMAN_ROLE = keccak256("CHAIRMAN_ROLE");
    bytes32 public constant DEPOSIT_BALANCE = keccak256("DEPOSIT_BALANCE");
    bytes32 public constant LAST_VOTING_TIME = keccak256("LAST_VOTING_TIME");

    mapping (bytes32 => ProposalCurrentInfo) public proposalInfo;
    mapping (address => mapping (bytes32 => uint256)) public userInfo;

    uint256 public totalSupply;
    SettingsDAO public settingsDAO;

    constructor(
        address _tokensAddress,
        uint88 _voitingTime,
        uint8 _minQuorumPercentage
    ) public {
        require(_minQuorumPercentage <=  100,
                "percentage must be less than or equal to 100");
        settingsDAO = SettingsDAO (
            _tokensAddress,
            _voitingTime,
            _minQuorumPercentage
        );
        _setupRole(CHAIRMAN_ROLE, msg.sender);
    }

    function deposit(uint256 _amount) external {
        address _tokenAddress = settingsDAO.tokensAddress; 
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
        userInfo[msg.sender][DEPOSIT_BALANCE] += _amount;
        totalSupply += _amount;
    }

    function withdrawDeposit() external {
        uint256 _depositBalance = userInfo[msg.sender][DEPOSIT_BALANCE];
        require(_depositBalance >  0,
                "you don`t have tokens on balance"
        );
        require(block.timestamp - userInfo[msg.sender][LAST_VOTING_TIME] 
                    > settingsDAO.voitingTime,
                "you don`t have rights to withdraw deposit"
        );
        IERC20(settingsDAO.tokensAddress).transfer(msg.sender, _depositBalance);
        totalSupply -= userInfo[msg.sender][DEPOSIT_BALANCE];
        userInfo[msg.sender][DEPOSIT_BALANCE] = 0;
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

    function voting(address recipient, bytes memory signature, uint256 createTime, bool flag) external {
        require(block.timestamp - createTime < settingsDAO.voitingTime,
                "proposal is finished"
        );   
        bytes32 proposalHash = keccak256(
            abi.encodePacked(
             recipient,
             signature,
             createTime)
        );
        require(userInfo[msg.sender][proposalHash] == 0,
                "you already voted"
        );
        require(_proposalInfo.accepted > 0,
                "proposal isn't activated"
        );
        userInfo[msg.sender][proposalHash] = 1;
        userInfo[msg.sender][LAST_VOTING_TIME] = block.timestamp;
        if (flag) {
            proposalInfo[proposalHash].accepted += userInfo[msg.sender][DEPOSIT_BALANCE];
        } else {
            proposalInfo[proposalHash].rejected += userInfo[msg.sender][DEPOSIT_BALANCE];
        }
        emit Voting(recipient, signature, createTime, msg.sender, flag);
    }

    function finishProposal(address recipient, bytes memory signature, uint256 createTime) external {
        require(block.timestamp - createTime > settingsDAO.voitingTime,
                "proposal isn't finished"
        );

        bytes32 proposalHash = keccak256(
            abi.encodePacked(
             recipient,
             signature,
             createTime)
        );

        ProposalCurrentInfo memory _proposalInfo = proposalInfo[proposalHash];
        require(_proposalInfo.accepted > 0,
                "proposal isn't activated"
        );
        // -2 from addProposal
        uint256 votesSumm = _proposalInfo.accepted + _proposalInfo.rejected - 2;
        uint256 _totalSupply = totalSupply;

        proposalInfo[proposalHash] = ProposalCurrentInfo(0,0);
        
        bool flag = true;
        if (settingsDAO.minQuorumPercentage > (votesSumm / _totalSupply) * 100) {
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

    event AddProposal(
        address indexed recipient,
        bytes signature,
        string description
    );

    event Voting(
        address indexed recipient,
        bytes signature,
        uint256 createTime,
        address voter,
        bool flag
    );

   event FinishProposal(
        address indexed recipient,
        bytes signature,
        uint256 createTime,
        bool result
    );
}