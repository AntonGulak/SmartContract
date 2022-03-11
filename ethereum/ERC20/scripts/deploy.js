const { ethers } = require("hardhat");

async function main() {
  const ERC20 = await ethers.getContractFactory("ERC20");
  const hardhatERC20 = await ERC20.deploy(1000);
  console.log("Contract deployed to:", hardhatERC20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });