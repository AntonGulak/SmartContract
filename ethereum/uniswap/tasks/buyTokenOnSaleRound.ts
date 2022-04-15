import { task } from "hardhat/config";

task("buyTokenOnSaleRound", "")
  .addParam("eth", "")
  .addParam("exchangeAddress", "")
  .setAction(async (taskArgs, hre) => {
    const { eth, exchangeAddress} = taskArgs;
    const platform = await hre.ethers.getContractAt(
      "Exchange",
      exchangeAddress
    );

    await platform.buyTokenOnSaleRound({
      value: hre.ethers.utils.parseEther(`${eth}`)
    });

  });
