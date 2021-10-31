
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";
import "deleteUnit.sol";
import "adittionInterface.sol";

contract baseStation is gameObject, AdittionInterface {

  address [] private unit;
  mapping (address => uint) public destToInt;


  function addUnit() external override  {
    tvm.accept();
 
    unit.push(msg.sender);
    destToInt[msg.sender] = unit.length - 1;
  }


  function getAddressUnit (uint index) public view returns (address) {
     return unit[index];
    }  


  function deleteUnitIndex(uint index) public checkOwner() {

    //require(unit.empty() == false);

    unit[index] = unit[unit.length - 1];
    unit.pop();
    } 

  function deleteUnit() external override {
    tvm.accept();

    //Проверка на то, что вызывает союзный юнит
    //require(destToInt.exists(msg.sender) == true);
      
    //require(unit.empty() == false);

    unit[destToInt[msg.sender]] = unit[unit.length - 1];
    unit.pop();

    }
    
    function sendAllValueAndDestroyed() public override checkOwner() {
      
       for (uint i = 0; i < unit.length; i++) {
         DeleteUnit un = DeleteUnit(unit[i]);
         un.deleteUnit(attacker);
       }

        attacker.transfer(1, true, 128 + 32);
    }
   

}