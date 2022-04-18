import { task } from "hardhat/config";

task("removeLiquidity", "")
  .addParam("tokenA", "")
  .addParam("tokenB", "")
  .addParam("liquidity", "")
  .addParam("amountAMin", "")
  .addParam("amountBMin", "")
  .addParam("to", "")
  .addParam("deadline", "")
  .addParam("adapterAddress", "")
  .setAction(async (taskArgs, hre) => {
    // const { tokenA, 
    //         tokenB,
    //         liquidity,
    //         amountAMin,
    //         amountBMin,
    //         to,
    //         deadline,
    //         adapterAddress} = taskArgs;

    // const adapter = await hre.ethers.getContractAt(
    //   "UniswapAdapter",
    //   adapterAddress
    // );

    // await adapter.removeLiquidity(
    //           tokenA,
    //           tokenB,
    //           liquidity,
    //           amountAMin,
    //           amountBMin,
    //           to,
    //           deadline
    //   );
  });
