import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Bridge contract", function () {


  let ethereumERC20: any;
  let ethereumBridge: any;

  let binanceERC20: any;
  let binanceBridge: any;

  let ethereum: SignerWithAddress;
  let binance: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let validator: SignerWithAddress;

  const totalAmountERC20: number = 1000;
  const ethereumId: number = 0;
  const binanceId: number = 1;
  const addressNull: string = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    [ethereum, binance, user, user2, validator] = await ethers.getSigners();
   

    let ERC20 = await ethers.getContractFactory("ERC20");

    ethereumERC20 = await ERC20.connect(ethereum).deploy(totalAmountERC20, "Ethereum", "ETH");
    await ethereumERC20.deployed();
    binanceERC20 = await ERC20.connect(ethereum).deploy(totalAmountERC20, "Binance", "BSC");
    await ethereumERC20.deployed();

    let bridge = await ethers.getContractFactory("Bridge");

    ethereumBridge = await bridge.connect(ethereum).deploy(validator.address);
    await ethereumBridge.deployed();
    binanceBridge = await bridge.connect(ethereum).deploy(validator.address);
    await binanceBridge.deployed();
   });

   it("constructor check", async function () {
    expect(await ethereumBridge.nodeValidator()).to.equal(validator.address);
  });

  it("changeNodeValidator check", async function () {
    await ethereumBridge.connect(ethereum).changeNodeValidator(user.address)
    expect(await ethereumBridge.nodeValidator()).to.equal(user.address);
  });

  it("includeToken check", async function () {
    expect(await ethereumBridge.ERC20Tokens(ethereumERC20.address, binanceId)).to.equal(addressNull);
    await ethereumBridge.connect(ethereum).includeToken(ethereumERC20.address, binanceERC20.address, binanceId);
    expect(await ethereumBridge.ERC20Tokens(ethereumERC20.address, binanceId)).to.equal(binanceERC20.address);
  });

  it("excludeToken check", async function () {
    expect(await ethereumBridge.ERC20Tokens(ethereumERC20.address, binanceId)).to.equal(addressNull);
    await ethereumBridge.connect(ethereum).includeToken(ethereumERC20.address, binanceERC20.address, binanceId);
    expect(await ethereumBridge.ERC20Tokens(ethereumERC20.address, binanceId)).to.equal(binanceERC20.address);
    await ethereumBridge.connect(ethereum).excludeToken(ethereumERC20.address, binanceId);
    expect(await ethereumBridge.ERC20Tokens(ethereumERC20.address, binanceId)).to.equal(addressNull);
  });

  it("swap check", async function () {
    await ethereumBridge.connect(ethereum).includeToken(ethereumERC20.address, binanceERC20.address, binanceId);
    await ethereumERC20.connect(ethereum).transfer(user.address, totalAmountERC20);
    await ethereumERC20.connect(user).approve(ethereumBridge.address, totalAmountERC20);
    await expect(ethereumBridge.connect(user).swap(
        ethereumERC20.address,
        user2.address,
        totalAmountERC20,
        binanceId,
        "ETH",
        1))
      .to.emit(ethereumBridge, "SwapInitialized")
      .withArgs(binanceERC20.address, user2.address, totalAmountERC20, binanceId, "ETH", 1);
    expect(await ethereumERC20.balanceOf(user.address)).to.equal(0);
    expect(await ethereumERC20.balanceOf(ethereumBridge.address)).to.equal(0);

    await expect(ethereumBridge.connect(user)
      .swap(addressNull, user2.address, totalAmountERC20, binanceId, "ETH", 1))
      .to.be.revertedWith(
      'You cannot use this token address'
    );
  });
  

});