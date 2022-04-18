import { task } from "hardhat/config";

task("swap", "")
  .addParam("amountIn", "")
  .addParam("amountOutMin", "")
  .addParam("token1", "")
  .addParam("token2", "")
  .addParam("to", "")
  .addParam("deadline", "")
  .addParam("adapterAddress", "")
  .setAction(async (taskArgs, hre) => {
    const { amountIn, amountOutMin, token1, token2, to, deadline, adapterAddress} = taskArgs;
    const adapter = await hre.ethers.getContractAt(
      "UniswapAdapter",
      adapterAddress
    );

    await adapter.swap(
          amountIn,
          amountOutMin,
          token1,
          token2,
          to,
          deadline);
  });
