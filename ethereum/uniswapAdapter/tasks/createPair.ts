import { task } from "hardhat/config";

task("createPair", "")
  .addParam("token1", "")
  .addParam("token2", "")
  .addParam("adapterAddress", "")
  .setAction(async (taskArgs, hre) => {
    const { token1, token2, adapterAddress} = taskArgs;
    const adapter = await hre.ethers.getContractAt(
      "UniswapAdapter",
      adapterAddress
    );

    await adapter.createPair(token1, token2);
  });
