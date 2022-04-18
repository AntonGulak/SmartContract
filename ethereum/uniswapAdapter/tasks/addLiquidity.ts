import { task } from "hardhat/config";

task("addLiquidity", "")
    .addParam("tokenA", "")
    .addParam("tokenB", "")
    .addParam("amountADesired", "")
    .addParam("amountBDesired", "")
    .addParam("amountAMin", "")
    .addParam("amountBMin", "")
    .addParam("to", "")
     .addParam("deadline", "")
    .addParam("adapterAddress", "")
    .setAction(async (taskArgs, hre) => {
    const { tokenA, 
            tokenB,
            amountADesired,
            amountBDesired, 
            amountAMin,
            amountBMin,
            to,
            deadline,
            adapterAddress} = taskArgs;

    const adapter = await hre.ethers.getContractAt(
      "UniswapAdapter",
      adapterAddress
    );

    await adapter.addLiquidity(
              tokenA,
              tokenB,
              amountADesired,
              amountBDesired,
              amountAMin,
              amountBMin,
              to,
              deadline
      );
  });
