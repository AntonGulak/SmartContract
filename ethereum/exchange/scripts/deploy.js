const { ethers } = require("hardhat");

async function main() {

  let Exchange = await ethers.getContractFactory("Exchange");
  let exchange = await Exchange.deploy();
  await exchange.deployed();
  console.log(exchange.address);

  let ERC20 = await ethers.getContractFactory("ERC20");
  let contractACDM = await ERC20.deploy("Crypton Academy", "ACDM", exchange.address);
  await contractACDM.deployed();
  console.log(ERC20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });