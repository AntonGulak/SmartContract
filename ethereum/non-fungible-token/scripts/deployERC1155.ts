import { ethers } from "hardhat";

async function main() {
  const ERC1155 = await ethers.getContractFactory("TokenERC1155");
  const hardhatERC1155 = await ERC1155.deploy("kek", "KEK", "https://ipfs.io/ipfs/QmPcB7LWpYKST5sboBkvM3BEnu2W1VXrBv7ZVmnhdnZgAf?filename=");
  console.log("Contract deployed to:", hardhatERC1155.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  