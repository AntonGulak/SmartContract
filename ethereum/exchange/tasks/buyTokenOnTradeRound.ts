import { task } from "hardhat/config";

task("buyTokenOnTradeRound", "")
  .addParam("eth", "")
  .addParam("exchangeAddress", "")
  .addParam("sellerAddress", "")
  .addParam("price", "")
  .setAction(async (taskArgs, hre) => {
    const { eth, exchangeAddress, sellerAddress, price} = taskArgs;
    const platform = await hre.ethers.getContractAt(
      "Exchange",
      exchangeAddress
    );

    await platform.buyTokenOnTradeRound(sellerAddress, price,
      {value: hre.ethers.utils.parseEther(`${eth}`)}
    );

  });
