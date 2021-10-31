
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

interface AddBase {
    
    function addUnit() external;
    function deleteUnit(uint index) external; 

}