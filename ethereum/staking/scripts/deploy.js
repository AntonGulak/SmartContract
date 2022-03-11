const { ethers } = require("hardhat");

async function main() {
  const ERC20 = await ethers.getContractFactory("ERC20");
  const hardhatERC20 = await ERC20.deploy("0x11943565fb8B6A9D61bF17cbdd3089602b8C0AdD", "0x9915134482d764Cb4EA2Fea2a0A0FB52e5506aAe");
  console.log("Contract deployed to:", hardhatERC20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });