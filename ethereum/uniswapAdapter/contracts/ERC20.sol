pragma solidity ^0.8.11;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract ERC20 is AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private totalTokens;
    string public name;
    string public symbol;

    mapping(address => uint256) private balances;
    mapping (address => mapping (address => uint256)) private allowedAmounts;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

     constructor(string memory _name,
                 string memory _symbol, 
                 address minterRole) {
        _setupRole(MINTER_ROLE, minterRole);
        name = _name;
        symbol = _symbol; 
    }

    function balanceOf(address _owner) external view returns (uint256 balance) {
        return balances[_owner];
    }

    function totalSupply() external view returns (uint256) {
        return totalTokens;
    }

    function allowance(address _owner, address _spender) external view returns (uint256 remaining) {
        return allowedAmounts[_owner][_spender];
    }

    function approve(address _spender, uint256 _value) external returns (bool success) {
        allowedAmounts[msg.sender][_spender] = _value;
        
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transfer(address _to, uint256 _value) external returns (bool success) {
        require(balances[msg.sender] >= _value, "error value");

        balances[msg.sender] = balances[msg.sender] - _value;
        balances[_to] = balances[_to] + _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success) {
        require(balances[_from] >= _value, "error value");
        require(allowedAmounts[_from][msg.sender] >= _value, "you don't right to tranfser tokens");

        allowedAmounts[_from][msg.sender] = allowedAmounts[_from][msg.sender] - _value;
        balances[_from] = balances[_from] - _value;
        balances[_to] = balances[_to] + _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function burn(uint256 _value) external  {
        require(balances[msg.sender] >= _value, 'tokens to burn can not be greater than balance');

        balances[msg.sender] = balances[msg.sender] - _value;
        totalTokens = totalTokens - _value;

        emit Transfer(msg.sender, address(0), _value);
    }

    function mint(address _to, uint256 _value) external onlyMinter {

        totalTokens = totalTokens + _value;
        balances[_to] = balances[_to] + _value;

        emit Transfer(address(0), _to, _value);
    }

    modifier onlyMinter() {
        require(
            hasRole(MINTER_ROLE, msg.sender),
            "function only for minter"
        );
        _;
    }
}