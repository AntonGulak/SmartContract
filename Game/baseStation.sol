
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";

contract baseStation is gameObject {

  address [] private unit;
  
  function pushUnit(address dest) public {
      tvm.accept();

      //Проверка адресса нужна ли?
      unit.push(dest); 
      }

    function deleteUnit(uint index) public {
      tvm.accept();

      unit[index] = unit[unit.length - 1];
      unit.pop;
    }



}