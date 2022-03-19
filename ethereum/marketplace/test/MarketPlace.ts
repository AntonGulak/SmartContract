import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ERC721 contract", function () {

  let hardhatERC721: any;
  let hardhatERC20: any;
  let hardhadMarketPlace: any;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  const address: string = "0xB02Ba27459f90Dab3F6BbeE7B54f04EFeA62e836";
  const amountERC20: number = 1000;
  const week: number = 604800;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    let ERC721 = await ethers.getContractFactory("TokenERC721");
    hardhatERC721 = await ERC721.connect(owner).deploy("Character", "CHARACTER");
    await hardhatERC721.deployed();

    let ERC20 = await ethers.getContractFactory("ERC20");
    hardhatERC20 = await ERC20.connect(user2).deploy(amountERC20);
    await hardhatERC20.deployed();

    let MarketPlace = await ethers.getContractFactory("MartketPlace");
    hardhadMarketPlace = await MarketPlace.connect(owner).deploy(hardhatERC20.address, hardhatERC721.address);
    await hardhadMarketPlace.deployed();

    await hardhatERC721.connect(owner).setupMinterRole(hardhadMarketPlace.address);

   });

  it("constructor check", async function () {
    expect(await hardhadMarketPlace.exchangeERC20Token()).to.equal(hardhatERC20.address);
    expect(await hardhadMarketPlace.ERC721Factory()).to.equal(hardhatERC721.address);
  });

  it("setExchangeERC20Token check", async function () {
    await hardhadMarketPlace.setExchangeERC20Token(address);
    expect(await hardhadMarketPlace.exchangeERC20Token()).to.equal(address);
  });

  it("setERC721Factory check", async function () {
    await hardhadMarketPlace.setERC721Factory(address);
    expect(await hardhadMarketPlace.ERC721Factory()).to.equal(address);
  });

  it("createItem check", async function () {
    await hardhadMarketPlace.connect(owner).createItem("", user1.address);
    expect(await hardhatERC721.balanceOf(user1.address)).to.equal(1);
    expect(await hardhatERC721.ownerOf(0)).to.equal(user1.address);
  });

  it("listItem check", async function () {
    await hardhadMarketPlace.connect(owner).createItem("", user1.address);
    await hardhatERC721.connect(user1).approve(hardhadMarketPlace.address, 0);
    await hardhadMarketPlace.connect(user1).listItem(0, 50, hardhatERC721.address);

    expect(await hardhatERC721.balanceOf(hardhadMarketPlace.address)).to.equal(1);
    expect(await hardhatERC721.ownerOf(0)).to.equal(hardhadMarketPlace.address);

    let timeStamp = (await ethers.provider.getBlock("latest")).timestamp;
    let hash = await hardhadMarketPlace.getHash(0, 50, 0, hardhatERC721.address, false, user1.address, timeStamp);

    expect((await hardhadMarketPlace.tokenInfo(hash)).currentPrice).to.equal(50);
    expect((await hardhadMarketPlace.tokenInfo(hash)).lastBuyer).to.equal('0x0000000000000000000000000000000000000000');
    expect((await hardhadMarketPlace.tokenInfo(hash)).bidsCounter).to.equal('0');
  });

  it("listItemOnAuction check", async function () {
    await hardhadMarketPlace.connect(owner).createItem("", user1.address);
    await hardhatERC721.connect(user1).approve(hardhadMarketPlace.address, 0);
    await hardhadMarketPlace.connect(user1).listItemOnAuction(0, 50, 20, hardhatERC721.address);

    expect(await hardhatERC721.balanceOf(hardhadMarketPlace.address)).to.equal(1);
    expect(await hardhatERC721.ownerOf(0)).to.equal(hardhadMarketPlace.address);

    let timeStamp = (await ethers.provider.getBlock("latest")).timestamp;
    let hash = await hardhadMarketPlace.getHash(0, 50, 20, hardhatERC721.address, true, user1.address, timeStamp);

    expect((await hardhadMarketPlace.tokenInfo(hash)).currentPrice).to.equal(50);
    expect((await hardhadMarketPlace.tokenInfo(hash)).lastBuyer).to.equal('0x0000000000000000000000000000000000000000');
    expect((await hardhadMarketPlace.tokenInfo(hash)).bidsCounter).to.equal('0');
  });

  it("cancel check", async function () {
    await hardhadMarketPlace.connect(owner).createItem("", user1.address);
    await hardhatERC721.connect(user1).approve(hardhadMarketPlace.address, 0);
    await hardhadMarketPlace.connect(user1).listItem(0, 50, hardhatERC721.address);

    expect(await hardhatERC721.balanceOf(hardhadMarketPlace.address)).to.equal(1);
    expect(await hardhatERC721.ownerOf(0)).to.equal(hardhadMarketPlace.address);

    let timeStamp = (await ethers.provider.getBlock("latest")).timestamp;
    let hash = await hardhadMarketPlace.getHash(0, 50, 0, hardhatERC721.address, false, user1.address, timeStamp);
 
    expect((await hardhadMarketPlace.tokenInfo(hash)).currentPrice).to.equal(50);
    await hardhadMarketPlace.connect(user1).cancel(0, 50, 0, hardhatERC721.address, timeStamp);
    expect((await hardhadMarketPlace.tokenInfo(hash)).currentPrice).to.equal(0);
  });

  it("buyItem check", async function () {
    await hardhadMarketPlace.connect(owner).createItem("", user1.address);
    await hardhatERC721.connect(user1).approve(hardhadMarketPlace.address, 0);
    await hardhadMarketPlace.connect(user1).listItem(0, 50, hardhatERC721.address);

    let timeStamp = (await ethers.provider.getBlock("latest")).timestamp;

    hardhatERC20.connect(user2).approve(hardhadMarketPlace.address, 50);
    await hardhadMarketPlace.connect(user2)
          .buyItem(0, 50, 0, hardhatERC721.address, user1.address, timeStamp
    );

    expect(await hardhatERC20.balanceOf(user1.address)).to.equal(50);
    expect(await hardhatERC20.balanceOf(user2.address)).to.equal(amountERC20 - 50);
    expect(await hardhatERC721.ownerOf(0)).to.equal(user2.address);
  });

  it("makeBid check", async function () {
    await hardhadMarketPlace.connect(owner).createItem("", user1.address);
    await hardhatERC721.connect(user1).approve(hardhadMarketPlace.address, 0);
    await hardhadMarketPlace.connect(user1).listItemOnAuction(0, 50, 20, hardhatERC721.address);

    let timeStamp = (await ethers.provider.getBlock("latest")).timestamp;
    let hash = await hardhadMarketPlace.getHash(0, 50, 20, hardhatERC721.address, true, user1.address, timeStamp);
    expect((await hardhadMarketPlace.tokenInfo(hash)).currentPrice).to.equal(50);

    hardhatERC20.connect(user2).approve(hardhadMarketPlace.address, 1000);
    await hardhadMarketPlace.connect(user2)
          .makeBid(70, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    );

    expect(await hardhatERC20.balanceOf(user2.address)).to.equal(amountERC20 - 70);
    expect(await hardhatERC20.balanceOf(hardhadMarketPlace.address)).to.equal(70);
    expect((await hardhadMarketPlace.tokenInfo(hash)).bidsCounter).to.equal(1);
    expect((await hardhadMarketPlace.tokenInfo(hash)).currentPrice).to.equal(70);
    expect((await hardhadMarketPlace.tokenInfo(hash)).lastBuyer).to.equal(user2.address);

    await expect(hardhadMarketPlace.connect(user2)
      .makeBid(80, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp))
      .to.be.revertedWith(
      "You bid is small"
    );
    expect((await hardhadMarketPlace.tokenInfo(hash)).bidsCounter).to.equal(1);

    await hardhatERC20.connect(user2).transfer(user3.address, 100);
    await hardhatERC20.connect(user3).approve(hardhadMarketPlace.address, 100);
    await hardhadMarketPlace.connect(user3)
      .makeBid(90, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    );
    expect(await hardhatERC20.balanceOf(hardhadMarketPlace.address)).to.equal(90);
    expect(await hardhatERC20.balanceOf(user2.address)).to.equal(amountERC20 - 100);
    expect(await hardhatERC20.balanceOf(user3.address)).to.equal(10);
    expect((await hardhadMarketPlace.tokenInfo(hash)).bidsCounter).to.equal(2);
    expect((await hardhadMarketPlace.tokenInfo(hash)).currentPrice).to.equal(90);
    expect((await hardhadMarketPlace.tokenInfo(hash)).lastBuyer).to.equal(user3.address);

    await ethers.provider.send("evm_increaseTime", [2 * week + 1]);
    await ethers.provider.send("evm_mine", []);

    await expect(hardhadMarketPlace.connect(user2)
      .makeBid(110, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp))
      .to.be.revertedWith(
      "Auction is finished"
    );
  });

  it("finishAuction check with fault", async function () {
    await hardhadMarketPlace.connect(owner).createItem("", user1.address);
    await hardhatERC721.connect(user1).approve(hardhadMarketPlace.address, 0);
    await hardhadMarketPlace.connect(user1).listItemOnAuction(0, 50, 20, hardhatERC721.address);

    let timeStamp = (await ethers.provider.getBlock("latest")).timestamp;

    hardhatERC20.connect(user2).approve(hardhadMarketPlace.address, 1000);
    await hardhadMarketPlace.connect(user2)
          .makeBid(70, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    );

    await hardhatERC20.connect(user2).transfer(user3.address, 100);
    await hardhatERC20.connect(user3).approve(hardhadMarketPlace.address, 100);
    await hardhadMarketPlace.connect(user3)
      .makeBid(90, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    );

    await expect(hardhadMarketPlace.connect(user3)
      .finishAuction(0, 50, 20, hardhatERC721.address, user1.address, timeStamp))
      .to.be.revertedWith(
      'Auction isn`t finished'
    );

    await ethers.provider.send("evm_increaseTime", [2 * week + 1]);
    await ethers.provider.send("evm_mine", []);

    await expect(hardhadMarketPlace.connect(user3)
      .finishAuction(0, 50, 20, hardhatERC721.address, user1.address, timeStamp))
      .to.be.revertedWith(
      'Auction cannot be finished'
    );
  });

  it("finishAuction check with success", async function () {
    await hardhadMarketPlace.connect(owner).createItem("", user1.address);
    await hardhatERC721.connect(user1).approve(hardhadMarketPlace.address, 0);
    await hardhadMarketPlace.connect(user1).listItemOnAuction(0, 50, 20, hardhatERC721.address);

    let timeStamp = (await ethers.provider.getBlock("latest")).timestamp;

    hardhatERC20.connect(user2).approve(hardhadMarketPlace.address, 1000);
    await hardhadMarketPlace.connect(user2)
          .makeBid(70, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    );

    await hardhatERC20.connect(user2).transfer(user3.address, 240);
    await hardhatERC20.connect(user3).approve(hardhadMarketPlace.address, 240);
    await hardhadMarketPlace.connect(user3)
      .makeBid(90, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    );

    hardhatERC20.connect(user2).approve(hardhadMarketPlace.address, 1000);
    await hardhadMarketPlace.connect(user3)
      .makeBid(150, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    );

    await ethers.provider.send("evm_increaseTime", [2 * week + 1]);
    await ethers.provider.send("evm_mine", []);

    await hardhadMarketPlace.connect(user3)
      .finishAuction(0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    );

    expect(await hardhatERC20.balanceOf(hardhatERC721.address)).to.equal(0);
    expect(await hardhatERC20.balanceOf(user3.address)).to.equal(90);
    expect(await hardhatERC20.balanceOf(user2.address)).to.equal(amountERC20 - (240));
    expect(await hardhatERC20.balanceOf(user1.address)).to.equal(150);
    expect(await hardhatERC721.ownerOf(0)).to.equal(user3.address);
  });

  it("cancelAuction check", async function () {
    await hardhadMarketPlace.connect(owner).createItem("", user1.address);
    await hardhatERC721.connect(user1).approve(hardhadMarketPlace.address, 0);
    await hardhadMarketPlace.connect(user1).listItemOnAuction(0, 50, 20, hardhatERC721.address);

    let timeStamp = (await ethers.provider.getBlock("latest")).timestamp;

    hardhatERC20.connect(user2).approve(hardhadMarketPlace.address, 1000);
    await hardhadMarketPlace.connect(user2)
          .makeBid(70, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    );

    await hardhatERC20.connect(user2).transfer(user3.address, 240);
    await hardhatERC20.connect(user3).approve(hardhadMarketPlace.address, 240);
    await hardhadMarketPlace.connect(user3)
      .makeBid(90, 0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    );

    await expect(hardhadMarketPlace.connect(user3)
      .cancelAuction(0, 50, 20, hardhatERC721.address, user1.address, timeStamp))
      .to.be.revertedWith(
      'Auction isn`t finished'
    );

    await ethers.provider.send("evm_increaseTime", [2 * week + 1]);
    await ethers.provider.send("evm_mine", []);
    await hardhadMarketPlace.connect(user3)
      .cancelAuction(0, 50, 20, hardhatERC721.address, user1.address, timeStamp
    )
    
    expect(await hardhatERC721.ownerOf(0)).to.equal(user1.address);
    expect(await hardhatERC20.balanceOf(user3.address)).to.equal(240);
    expect(await hardhatERC20.balanceOf(user2.address)).to.equal(amountERC20 - (240));
    expect(await hardhatERC721.ownerOf(0)).to.equal(user1.address);
  });

});