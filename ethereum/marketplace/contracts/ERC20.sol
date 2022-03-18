pragma solidity ^0.8.11;

contract ERC20 {

    address public owner;
    uint256 private totalTokens;

    mapping(address => uint256) private balances;
    mapping (address => mapping (address => uint256)) private allowedAmounts;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

     constructor(uint256 _totalTokens) {
        totalTokens = _totalTokens;
        balances[msg.sender] = _totalTokens;
        owner = msg.sender;

        emit Transfer(address(0), msg.sender, _totalTokens);
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function totalSupply() public view returns (uint256) {
        return totalTokens;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowedAmounts[_owner][_spender];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowedAmounts[msg.sender][_spender] = _value;
        
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value, "error value");

        balances[msg.sender] = balances[msg.sender] - _value;
        balances[_to] = balances[_to] + _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balances[_from] >= _value, "error value");
        require(allowedAmounts[_from][msg.sender] >= _value, "you don't right to tranfser tokens");

        allowedAmounts[_from][msg.sender] = allowedAmounts[_from][msg.sender] - _value;
        balances[_from] = balances[_from] - _value;
        balances[_to] = balances[_to] + _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function burn(uint256 _value) public {
        require(balances[msg.sender] >= _value, 'tokens to burn can not be greater than balance');

        balances[msg.sender] = balances[msg.sender] - _value;
        totalTokens = totalTokens - _value;

        emit Transfer(msg.sender, address(0), _value);
    }

    function mint(address _to, uint256 _value) public onlyOwner {

        totalTokens = totalTokens + _value;
        balances[_to] = balances[_to] + _value;

        emit Transfer(address(0), _to, _value);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'function only for owner');
        _;
    }
}