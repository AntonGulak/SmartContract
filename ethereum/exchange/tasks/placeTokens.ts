import { task } from "hardhat/config";

task("placeTokens", "")
  .addParam("amount", "")
  .addParam("price", "")
  .addParam("erc20Address", "")
  .addParam("exchangeAddress", "")
  .setAction(async (taskArgs, hre) => {
    const { amount, price, erc20Address, exchangeAddress} = taskArgs;
    const platform = await hre.ethers.getContractAt(
      "Exchange",
      exchangeAddress
    );

    const token = await hre.ethers.getContractAt("ERC20", erc20Address);
    await token.approve(exchangeAddress, amount);

    const priceETH = hre.ethers.utils.parseEther(`${price}`);
    await platform.addOrder(amount, priceETH);

  });
