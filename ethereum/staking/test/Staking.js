const { expect } = require("chai")
const { ethers } = require("hardhat");

describe("Staking contract", function () {

  let rewardTokens;
  let LPTokens;
  let staking;
  let user;
  let swapServiceOwner;

  beforeEach(async function () {
    [user, swapServiceOwner] = await ethers.getSigners();
    let ERC20 = await ethers.getContractFactory("ERC20");
    rewardTokens = await ERC20.connect(swapServiceOwner).deploy(100000);
    LPTokens = await ERC20.connect(user).deploy(1000);
    await rewardTokens.deployed();
    await LPTokens.deployed();

    let Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.connect(swapServiceOwner).deploy(LPTokens.address, rewardTokens.address);
   });

  it("constructor check", async function () {
    expect(await staking.rewardCoeff()).to.equal(20);
    expect(await staking.period()).to.equal(1200);
    expect(await staking.LPtokensAddress()).to.equal(LPTokens.address);
    expect(await staking.rewardTokens()).to.equal(rewardTokens.address);
  });

  it("stake check", async function () {
    expect(staking.connect(user)
      .stake(100)).to.be.revertedWith(
      "error approve"
      );

    await LPTokens.connect(user).approve(staking.address, 1100);
    expect(staking.connect(user)
      .stake(10000)).to.be.revertedWith(
      "error balance"
      );

    await staking.connect(user).stake(100);
    expect(await staking.stakes(user.address)).to.equal(100);
    expect(await LPTokens.balanceOf(user.address)).to.equal(900);
  });

  it("check owner functions", async function () {
    await staking.connect(swapServiceOwner).setRewardCoeffForPeriod(10);
    expect(await staking.rewardCoeff()).to.equal(10);

    await staking.connect(swapServiceOwner).setLockedTime(100);
    expect(await staking.period()).to.equal(100);

    expect(staking.connect(user)
      .setLockedTime(150)).to.be.revertedWith(
      "function only for owner"
      );

    expect(staking.connect(user)
      .setRewardCoeffForPeriod(150)).to.be.revertedWith(
      "function only for owner"
      );
    });

    it("unstake check", async function () {
      expect(staking.connect(user)
        .unstake()).to.be.revertedWith(
        "'you don`t have tokens on balance"
      );

      await LPTokens.connect(user).approve(staking.address, 100);
      await staking.connect(user).stake(100);
      await ethers.provider.send("evm_increaseTime", [1200]);
      await network.provider.send("evm_mine");
      await staking.connect(user).unstake();

      expect(await staking.stakes(user.address)).to.equal(0);
      expect(await LPTokens.balanceOf(user.address)).to.equal(1000);
    });

    it("time check", async function () {
      await LPTokens.connect(user).approve(staking.address, 1000);

      let blockNumBefore = await ethers.provider.getBlockNumber();
      let blockBefore = await ethers.provider.getBlock(blockNumBefore);
      let time1 = blockBefore.timestamp;

      await staking.connect(user).stake(100);
      let time1FromContract = await staking.time(user.address);

      await ethers.provider.send("evm_increaseTime", [10000]);
      await network.provider.send("evm_mine");

      blockNumBefore = await ethers.provider.getBlockNumber();
      blockBefore = await ethers.provider.getBlock(blockNumBefore);
      let time2 = blockBefore.timestamp;

      await staking.connect(user).stake(100);
      let time2FromContract =  await staking.time(user.address);

      expect(time2 - time1).to.equal(time2FromContract - time1FromContract);
    });

    it("claim check", async function () {
      await rewardTokens.connect(swapServiceOwner).approve(staking.address, 10000);
      await LPTokens.connect(user).approve(staking.address, 1000);

      await staking.connect(user).stake(1);
      await ethers.provider.send("evm_increaseTime", [1200]);
      await network.provider.send("evm_mine");
      await expect(staking.connect(user)
         .claim(user.address)).to.be.revertedWith(
         "reward is not an integer"
      );

      await ethers.provider.send("evm_increaseTime", [6000]);
      await network.provider.send("evm_mine");
      await staking.connect(user).claim(user.address);
      expect(await rewardTokens.balanceOf(user.address)).to.equal(1);
      expect(await staking.accumulatedReward(user.address)).to.equal(20);

      await ethers.provider.send("evm_increaseTime", [4800]);
      await network.provider.send("evm_mine");
      await staking.connect(user).claim(user.address);
      expect(await rewardTokens.balanceOf(user.address)).to.equal(2);
      expect(await staking.accumulatedReward(user.address)).to.equal(0);

      await staking.connect(user).stake(100);
      await expect(staking.connect(user)
        .claim(user.address)).to.be.revertedWith(
        "error time"
      );
      await ethers.provider.send("evm_increaseTime", [1200]);
      await network.provider.send("evm_mine");

      await staking.connect(user).stake(100);
      expect((Math.floor(await staking.accumulatedReward(user.address) / 100))).to.equal(20);
      expect(await staking.stakes(user.address)).to.equal(200 + 1);

      await ethers.provider.send("evm_increaseTime", [1200]);
      await network.provider.send("evm_mine"); 

      await staking.connect(user).claim(user.address);
      expect(await rewardTokens.balanceOf(user.address)).to.equal(60 + 2);
    });
});
