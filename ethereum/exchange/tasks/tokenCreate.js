
task("mintERC721", "to mint your ERC721 token")
  .addParam("contract", "The ERC721 contract's address")
  .addParam("metadata", "Metadata for token")
  .addParam("owner", "Token owner")
  .setAction(async (taskArgs, hre) => {
    let wallet = await ethers.getSigner();
    const MarketPlace = await ethers.getContractFactory("MarketPlace");
    const marketPlacehardhat = await MarketPlace.attach(taskArgs.contract);
    await marketPlacehardhat.connect(wallet).createItem(taskArgs.metadata, taskArgs.owner);
  });
