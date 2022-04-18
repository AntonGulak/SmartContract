const { ethers } = require("hardhat");
import { ERC20, UniswapAdapter } from '../typechain-types'

async function main() {

  let UniswapAdapter = await ethers.getContractFactory("UniswapAdapter");
  let uniswapAdapter = <UniswapAdapter>(await UniswapAdapter.deploy(process.env.ROUTER_ADDRESS, process.env.FACTORY_ADDRESS));
  await uniswapAdapter.deployed();
  console.log(uniswapAdapter.address);

  const Token = await ethers.getContractFactory("ERC20");
  let tokenTST = <ERC20>(await Token.deploy(
      "TST",
      "TST",
      ethers.utils.parseUnits("1000000", ethers.BigNumber.from(18) )
  ));
  await tokenTST.deployed();

  console.log(tokenTST.address);

  let tokenACDM = <ERC20>(await Token.deploy(
      "ACDM",
      "ACDM",
      ethers.utils.parseUnits("1000000", ethers.BigNumber.from(18) )
  ));
  await tokenACDM.deployed();

  console.log(tokenACDM.address);

  let tokenPOP = <ERC20>(await Token.deploy(
      "POP",
      "POP",
      ethers.utils.parseUnits("1000000", ethers.BigNumber.from(18) )
  ));
  await tokenPOP.deployed();

  console.log(tokenPOP.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
