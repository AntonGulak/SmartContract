const { ethers } = require("hardhat");


async function main() {
  const Donations = await ethers.getContractFactory("Donations");
  const hardhatDonations = await Donations.deploy();
  console.log("Contract deployed to:", hardhatDonations.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });