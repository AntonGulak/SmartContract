const { ethers } = require("hardhat");

async function main() {
  const ERC20 = await ethers.getContractFactory("ERC20");
  const hardhatERC20 = await ERC20.deploy(1000);

  const ERC721 = await ethers.getContractFactory("TokenERC721");
  const hardhatERC721 = await ERC721.deploy("Character1", "CHARACTER1");

  const MarketPlace = await ethers.getContractFactory("MarketPlace");
  const hardhatMarketPlace = await MarketPlace.deploy(hardhatERC20.address, hardhatERC721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });