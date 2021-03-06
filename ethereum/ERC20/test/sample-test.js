const { expect } = require("chai")
const { ethers } = require("hardhat");

describe("ERC20 contract", function () {

  let ERC20;
  let hardhatERC20;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    ERC20 = await ethers.getContractFactory("ERC20");
    hardhatERC20 = await ERC20.deploy(100);
    await hardhatERC20.deployed();
   });

  it("owner check", async function () {
    expect(await hardhatERC20.owner()).to.equal(owner.address);
  });

  it("constructor check", async function () {
    expect(await hardhatERC20.totalSupply()).to.equal(100);
    expect(await hardhatERC20.balanceOf(owner.address)).to.equal(100);
  });

  it("approve check", async function () {
    await hardhatERC20.connect(owner).approve(user1.address, 7);
    expect(await hardhatERC20.allowance(owner.address, user1.address))
                 .to.equal(7);
  });

  it("transfer check", async function () {
   await hardhatERC20.connect(owner).transfer(user1.address, 7);
    expect(await hardhatERC20.balanceOf(user1.address))
      .to.equal(7);
    expect(await hardhatERC20.balanceOf(owner.address))
      .to.equal(93);

    await hardhatERC20.connect(owner).transfer(user1.address, 10);
    expect(await hardhatERC20.balanceOf(user1.address))
      .to.equal(17);
    expect(await hardhatERC20.balanceOf(owner.address)) 
      .to.equal(83);     
    
    expect(hardhatERC20.connect(owner)
      .transfer(user1.address, 100)).to.be.revertedWith(
      "error value"
      );
  });

  it("transferFrom check", async function () {
    expect(hardhatERC20.transferFrom(owner.address, user1.address, 1000))
      .to.be.revertedWith(
      "error value"
    );
    await hardhatERC20.connect(owner).approve(user1.address, 7);
    expect(hardhatERC20.connect(user2).transferFrom(owner.address, user2.address, 7))
      .to.be.revertedWith(
      "you don't right to tranfser tokens"
    );
    await hardhatERC20.connect(user1).transferFrom(owner.address, user2.address, 7);
    expect(await hardhatERC20.balanceOf(user2.address))
      .to.equal(7);
    expect(await hardhatERC20.balanceOf(owner.address)) 
      .to.equal(93); 
  });

  it("burn check", async function () {
    expect(hardhatERC20.burn(1000))
      .to.be.revertedWith(
      "tokens to burn can not be greater than balance"
    );
    await hardhatERC20.connect(owner).burn(7);
    expect(await hardhatERC20.balanceOf(owner.address)) 
      .to.equal(93); 
    expect(await hardhatERC20.totalSupply()).to.equal(93);
  });

  it("onlyOwner check", async function () {
    expect(hardhatERC20.connect(user1).mint(user1.address, 7))
      .to.be.revertedWith(
      "function only for owner"
    );
  });

  it("mint check", async function () {
    await hardhatERC20.connect(owner).mint(user1.address, 7);
    expect(await hardhatERC20.totalSupply()).to.equal(107);
    expect(await hardhatERC20.balanceOf(user1.address)) 
       .to.equal(7);  
  });
  
});
