import { task } from "hardhat/config";


task("startSaleRound", "")
  .addParam("exchangeAddress", "")
  .setAction(async (taskArgs, hre) => {
    const { exchangeAddress } = taskArgs;
    const platform = await hre.ethers.getContractAt(
      "Exchange",
      exchangeAddress
    );
    await platform.startSaleRound();
  });
