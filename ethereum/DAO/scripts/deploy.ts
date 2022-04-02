const { ethers } = require("hardhat");
 
const day: number = 86400;
const minQuorum: number = 75;

async function main() {

  let ERC20 = await ethers.getContractFactory("ERC20");
  let tokens = await ERC20.deploy(1000, "Crypton", "CRPTN");
  await tokens.deployed();

  let DAOcontract = await ethers.getContractFactory("DAO");
  let DAO = await DAOcontract.deploy(tokens.address, 3 * day, minQuorum);
  await DAO.deployed();

  console.log("DAO deployed to:", DAO.address);

  let Counter = await ethers.getContractFactory("Counter");
  let counter = await Counter.deploy(DAO.address);
  await counter.deployed();
}

//0x72EF01E5d71A9BED861aB05dCA0bBb0874bfBB46

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });