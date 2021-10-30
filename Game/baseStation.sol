
pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "gameObject.sol";
import "militaryUnit.sol";

contract baseStation is gameObject {

  address[] private war;
  address[] private arch;
  
  function pushWarrior() private {
      tvm.accept();

      warrior w = new warrior();
      war.push(w);
      }

  function pushArcher() private {
      tvm.accept();

      warrior w = new warrior();
      war.push(w);
      }      

    function deleteWarrior(uint index) private {
      tvm.accept();
      //Проверка на пустоту

      war[index] = war[war.length - 1];
      war.pop;
    }

    function deleteArcher(uint index) private {
      tvm.accept();
      //Проверка на пустоту

      arch[index] = arch[arch.length - 1];
      arch.pop;
    }


}


contract warrior is militaryUnit {


}

contract archer is militaryUnit {


}