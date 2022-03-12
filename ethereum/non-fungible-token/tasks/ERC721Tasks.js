
task("mintERC721", "to mint your ERC721 token")
  .addParam("contract", "The ERC721 contract's address")
  .addParam("metadata", "Metadata for token")
  .setAction(async (taskArgs, hre) => {
    let wallet = await ethers.getSigner();
    const ERC721 = await ethers.getContractFactory("TokenERC721");
    const ERC721hardhat = await ERC721.attach(taskArgs.contract);
    await ERC721hardhat.connect(wallet).mint(taskArgs.metadata);
  });
