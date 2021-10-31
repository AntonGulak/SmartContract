
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";
import "deleteUnit.sol";

contract baseStation is gameObject {

  address [] private unit;
  mapping (address => uint) private destToInt;


  function addUnit() public  {
    tvm.accept();
    unit.push(msg.sender);
    destToInt[msg.sender] = unit.length - 1;
  }


  function getAddressUnit (uint index) public view returns (address) {
     return unit[index];
    }  

  //Проверить, что удаляетименно база

  function deleteUnitIndex(uint index) public checkOwner() {

    //Проверить на пустоту
    unit[index] = unit[unit.length - 1];
    unit.pop();
    }

  function deleteUnit() external {
    tvm.accept();
      
    //Проверить на пустоту
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