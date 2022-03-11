
task("staking", "To make a stake")
  .addParam("contract", "The staking contract's address")
  .addParam("amount", "Amount")
  .setAction(async (taskArgs) => {
    let wallet = await ethers.getSigner();
    const ERC20 = await ethers.getContractFactory("Staking");
    const ERC20hardhat = await ERC20.attach(taskArgs.contract)

    await ERC20hardhat.connect(wallet).stake(taskArgs.amount);
  });

  task("unstaking", "To make a stake")
  .addParam("contract", "The staking contract's address")
  .addParam("amount", "Amount")
  .setAction(async (taskArgs) => {
    let wallet = await ethers.getSigner();
    const ERC20 = await ethers.getContractFactory("Staking");
    const ERC20hardhat = await ERC20.attach(taskArgs.contract)

    await ERC20hardhat.connect(wallet).unstake(taskArgs.amount);
  });

  task("claim", "To get reward")
  .addParam("contract", "The staking contract's address")
  .addParam("wallet", "The wallet`s address")
  .setAction(async (taskArgs) => {
    let wallet = await ethers.getSigner();
    const ERC20 = await ethers.getContractFactory("Staking");
    const ERC20hardhat = await ERC20.attach(taskArgs.contract)

    await ERC20hardhat.connect(wallet).claim(taskArgs.wallet);
  });



  module.exports = {};