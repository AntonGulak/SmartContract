const { ethers } = require("hardhat");
 
const day: number = 86400;
const minQuorum: number = 75;

async function main() {

  let ERC20 = await ethers.getContractFactory("ERC20");
  let tokens = await ERC20.deploy(1000, "Crypton", "CRPTN");
  await tokens.deployed();

  console.log("tokens deployed to:", tokens.address);

  let DAOcontract = await ethers.getContractFactory("DAO");
  let DAO = await DAOcontract.deploy(tokens.address, 3 * day, minQuorum);
  await DAO.deployed();

  console.log("DAO deployed to:", DAO.address);

  let Counter = await ethers.getContractFactory("Counter");
  let counter = await Counter.deploy(DAO.address);
  await counter.deployed();

  console.log("counter deployed to:", counter.address);


  
}

//0xBE4B0e76aab7b99F9b2F4a9aE25D343e1f0d9994
//https://rinkeby.etherscan.io/address/0xBE4B0e76aab7b99F9b2F4a9aE25D343e1f0d9994#code

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });