const { ethers } = require("hardhat");

async function main() {
  const ERC721 = await ethers.getContractFactory("Character");
  const hardhatERC721 = await ERC721.deploy();
  console.log("Contract deployed to:", hardhatERC721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });