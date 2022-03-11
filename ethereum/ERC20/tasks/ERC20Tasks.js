
//0xce1817a3Ae3A3Bc9206F65dd975009CC88078EC2

task("transfer", "To make a transfer")
  .addParam("contract", "The ERC20 contract's address")
  .addParam("dest", "The recipient`s address")
  .addParam("amount", "Amount")
  .setAction(async (taskArgs) => {
    let wallet = await ethers.getSigner();
    const ERC20 = await ethers.getContractFactory("ERC20");
    const ERC20hardhat = await ERC20.attach(taskArgs.contract)

    await ERC20hardhat.connect(wallet).transfer(taskArgs.dest, taskArgs.amount);
  });

  task("transferFrom", "To make a transfer (for shops, you need to approve")
    .addParam("wallet", "The wallet's address")
    .addParam("contract", "The ERC20 contract's address")
    .addParam("dest", "The recipient`s address")
    .addParam("amount", "Amount")
    .setAction(async (taskArgs) => {
      let wallet = await ethers.getSigner();
      const ERC20 = await ethers.getContractFactory("ERC20");
      const ERC20hardhat = await ERC20.attach(taskArgs.contract)

      await ERC20hardhat.connect(wallet).transferFrom(taskArgs.wallet, taskArgs.dest, taskArgs.amount);
  });

  task("approve", "To approve transaction")
    .addParam("contract", "The ERC20 contract's address")
    .addParam("dest", "The recipient`s address")
    .addParam("amount", "Amount")
    .setAction(async (taskArgs) => {
      let wallet = await ethers.getSigner();
      const ERC20 = await ethers.getContractFactory("ERC20");
      const ERC20hardhat = await ERC20.attach(taskArgs.contract)

      await ERC20hardhat.connect(wallet).approve(taskArgs.dest, taskArgs.amount);
  });

  module.exports = {};