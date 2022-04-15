const { ethers } = require("hardhat");

async function main() {

  let UniswapAdapter = await ethers.getContractFactory("UniswapAdapter");
  let uniswapAdapter = await UniswapAdapter.deploy(process.env.ROUTER_ADDRESS, process.env.FACTORY_ADDRESS);
  await uniswapAdapter.deployed();
  console.log(uniswapAdapter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });