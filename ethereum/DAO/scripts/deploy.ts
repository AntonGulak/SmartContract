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

// tokens deployed to: 0xe58670b31616d458620246214bb6A1fd5046C4A0
// DAO deployed to: 0xAf4bc82dE34E095f77784F6c747FE8a388d16823
// counter deployed to: 0x640dFF6dbeaaC90fC1A68C0ACcc7c5820D9e96FC

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });