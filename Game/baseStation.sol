
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";

contract baseStation is gameObject {

  address [] private unit;

    function getAddressUnit (uint index) public view returns (address) {
     return unit[index];
    }  
  

  function CallParentContract(uint8 ind) external override{
    if (ind == 0) {
      pushUnit(msg.sender);
    }
  }
  
  function pushUnit(address dest) private {
      tvm.accept();
  
      unit.push(dest); 
      }

    function deleteUnit(uint index) private {
      tvm.accept();
      
      //Проверить на пустоту
      unit[index] = unit[unit.length - 1];
      unit.pop();
    }



}