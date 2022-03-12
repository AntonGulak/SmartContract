
task("balanceOfERC1155", "to mint your ERC721 token")
  .addParam("contract", "The 1155 contract's address")
  .addParam("id", "token id")
  .setAction(async (taskArgs, hre) => {
    let wallet = await ethers.getSigner();
    const ERC721 = await ethers.getContractFactory("TokenERC1155");
    const ERC721hardhat = await ERC721.attach(taskArgs.contract);
    let balance = await ERC721hardhat.connect(wallet).balanceOf(wallet.address, taskArgs.id);
    console.log(balance);
  });

  
task("mintERC1155", "to mint your ERC1155 token")
.addParam("contract", "The ERC1155 contract's address")
.addParam("tokenid", "token id")
.addParam("amount", "amount tokens")
.setAction(async (taskArgs, hre) => {
  let wallet = await ethers.getSigner();
  const ERC721 = await ethers.getContractFactory("TokenERC1155");
  const ERC721hardhat = await ERC721.attach(taskArgs.contract);
  let balance = await ERC721hardhat.connect(wallet).mint(taskArgs.tokenid, taskArgs.amount);
});
