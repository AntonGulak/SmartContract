pragma solidity >= 0.8.11;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Staking is AccessControl {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public LPtokensAddress;
    address public rewardTokens;
    address public owner;

    uint public rewardCoeff;
    uint public period;

    mapping (address => uint) public stakes;
    mapping (address => uint) public time;
    mapping (address => uint) public accumulatedReward;


    constructor(
        address _LPtokensAddress,
        address _rewardTokens
    ) public {
        LPtokensAddress = _LPtokensAddress;  
        rewardTokens = _rewardTokens;
        period = 20 minutes;
        rewardCoeff = 20;

        owner = msg.sender;
        _setupRole(ADMIN_ROLE, msg.sender);                        
    }

    function claim(address _wallet) external updateReward(msg.sender) {
        require(block.timestamp - time[msg.sender] >=  period,  "error time");
        require(accumulatedReward[msg.sender] >=  100,  "reward is not an integer");
        
        IERC20(rewardTokens).transferFrom(
            owner,
            _wallet,
            accumulatedReward[msg.sender] / 100);
            
        accumulatedReward[msg.sender] = accumulatedReward[msg.sender] - (accumulatedReward[msg.sender] / 100) * 100;
        time[msg.sender] = block.timestamp;
    }

    function stake(uint _amount) external updateReward(msg.sender) {
        require(
            IERC20(LPtokensAddress).balanceOf(msg.sender) >=  _amount, 
            "error balance"
        );
        require(
            IERC20(LPtokensAddress).allowance(msg.sender, address(this)) >=  _amount,
            "error approve"
        );

        IERC20(LPtokensAddress).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        stakes[msg.sender] = stakes[msg.sender] + _amount;
    }

    function unstake() external updateReward(msg.sender) {
        require(stakes[msg.sender] >  0,  "you don`t have tokens on balance");
        IERC20(LPtokensAddress).transfer(msg.sender, stakes[msg.sender]);
        stakes[msg.sender] = 0;
    }

    function setRewardCoeffForPeriod(uint percentage) external {
        require(
            hasRole(ADMIN_ROLE, msg.sender),
            "function only for owner"
        );
        rewardCoeff = percentage;
    }

    function setLockedTime(uint _amount) external {
        require(
            hasRole(ADMIN_ROLE, msg.sender),
            "function only for owner"
        );
        period = _amount;
    }

    modifier updateReward(address account) {
        uint timeCoeff = (block.timestamp - time[account]) / period;
        accumulatedReward[account] += timeCoeff * rewardCoeff * stakes[account];
        _;
        time[msg.sender] = block.timestamp;
    }
}