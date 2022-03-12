
import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ERC721 contract", function () {

  let hardhatERC1155: any;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const baseURL: string = "https://ipfs.io/ipfs/QmPcB7LWpYKST5sboBkvM3BEnu2W1VXrBv7ZVmnhdnZgAf?filename=";

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    let ERC1155 = await ethers.getContractFactory("TokenERC1155");
    hardhatERC1155 = await ERC1155.deploy("Character", "CHARACTER", baseURL);
    await hardhatERC1155.deployed();
   });

  it("constructor check", async function () {
    expect(await hardhatERC1155.name()).to.equal("Character");
    expect(await hardhatERC1155.symbol()).to.equal("CHARACTER");
  });

  
  it("mint check", async function () {
    await hardhatERC1155.connect(owner).mint(0, 100);
    expect(await hardhatERC1155.balanceOf(owner.address, 0)).to.equal(100);
  });

  it("burn check", async function () {
    await hardhatERC1155.connect(owner).mint(0, 100);
    await hardhatERC1155.connect(owner).burn(0, 42);
    expect(await hardhatERC1155.balanceOf(owner.address, 0)).to.equal(58);
  });

  it("admin role check", async function () {
     await expect(hardhatERC1155.connect(user1).mint(0, 100))
      .to.be.revertedWith(
      "function only for admin"
  );

  it("uri check", async function () {
    expect(await hardhatERC1155.uri(0)).to.equal(baseURL + "0.json");
    expect(await hardhatERC1155.uri(1)).to.equal(baseURL + "1.json");
    expect(await hardhatERC1155.uri(2)).to.equal(baseURL + "2.json");
  });

  });




});