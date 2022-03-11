require("@nomiclabs/hardhat-web3");

task("donate", "To make a donation")
  .addParam("contract", "The donation contract's address")
  .addParam("amount", "Donation amount")
  .setAction(async (taskArgs) => {
    let wallet = await ethers.getSigner();
    const Donations = await ethers.getContractFactory("Donations");
    const donations = await Donations.attach(taskArgs.contract)

    await donations.connect(wallet).donate({
        value: taskArgs.amount
      });
  });

task("showBenefactors", "To get list benefactors")
  .addParam("contract", "The donation contract's address")
  .setAction(async (taskArgs) => {
    const Donations = await ethers.getContractFactory("Donations");
    const donations = await Donations.attach(taskArgs.contract)

    console.log(await donations.showAllbenefactors());
  });

task("showSummDonations", "To get donation amount by user address")
  .addParam("contract", "The donation contract's address")
  .addParam("user", "The user's address")
  .setAction(async (taskArgs) => {
    const Donations = await ethers.getContractFactory("Donations");
    const donations = await Donations.attach(taskArgs.contract)

    console.log(await donations.balanceOf(taskArgs.user));
  });

  task("tranfser", "To send cryptocurrency from donations smartcontract")
  .addParam("contract", "The donation contract's address")
  .addParam("destination", "Recipient")
  .addParam("amount", "amount")
  .setAction(async (taskArgs) => {
    const Donations = await ethers.getContractFactory("Donations");
    const donations = await Donations.attach(taskArgs.contract)

    await donations.transfer(taskArgs.destination, taskArgs.amount);
  });  

  task("balance", "Prints an account's balance")
  .addParam("contract", "The account's address")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.contract);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
  });

  module.exports = {};