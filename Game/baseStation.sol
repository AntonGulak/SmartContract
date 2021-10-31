
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";
import "addUnit.sol";
import "deleteUnit.sol";

contract baseStation is gameObject, AddUnit {

  address [] private unit;

  function addUnit() external override {
    tvm.accept();
    unit.push(msg.sender);
  }


  function getAddressUnit (uint index) public view returns (address) {
     return unit[index];
    }  

  //Проверить, что удаляетименно база

  function deleteUnit(uint index) private {
    tvm.accept();
      
    //Проверить на пустоту
    unit[index] = unit[unit.length - 1];
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