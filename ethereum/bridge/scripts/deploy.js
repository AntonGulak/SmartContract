const { ethers } = require("hardhat");

async function main() {

  let bridge = await ethers.getContractFactory("Bridge");
  ethereumBridge = await bridge.deploy(validator.address, 0);
  await ethereumBridge.deployed();

  console.log(ethereumBridge.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });