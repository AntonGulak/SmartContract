
import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ERC721 contract", function () {

  let hardhatERC721: any;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const baseURL1: string = "https://ipfs.io/ipfs/";
  const baseURL2: string = "https://ipfs2.io/ipfs/";

  const meta1: string = "QmYsVCpU3b4bByKVfV5Xg6nkDZLWNB7drYnXJBTP2JSWdz";

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    let ERC721 = await ethers.getContractFactory("TokenERC721");
    hardhatERC721 = await ERC721.deploy("Character", "CHARACTER");
    await hardhatERC721.deployed();
   });

  it("constructor check", async function () {
    expect(await hardhatERC721.name()).to.equal("Character");
    expect(await hardhatERC721.symbol()).to.equal("CHARACTER");
  });

  it("mint check", async function () {
    expect(await hardhatERC721.meta_to_flag(meta1)).
    to.equal(false);

    await hardhatERC721.connect(owner).mint(meta1);
    expect(await hardhatERC721.name()).to.equal("Character");

    expect(await hardhatERC721.id_to_meta(0)).
        to.equal(meta1);
    expect(await hardhatERC721.meta_to_flag(meta1)).
        to.equal(true);

    expect(hardhatERC721.connect(owner).mint(meta1))
      .to.be.revertedWith(
      "token repetition"
    );  
  });
  
  it("burn check", async function () {
    await hardhatERC721.connect(owner).mint(meta1);
    await hardhatERC721.connect(owner).burn(0);

    expect(await hardhatERC721.meta_to_flag(meta1))
      .to.equal(false);
    expect(await hardhatERC721.id_to_meta(0))
      .to.equal("");
  });

  it("get tokenURI check", async function () {
    await hardhatERC721.connect(owner).mint(meta1);
    expect(await hardhatERC721.tokenURI(0)).to.equal(baseURL1 + meta1);
    expect(hardhatERC721.connect(user1).tokenURI(1))
      .to.be.revertedWith(
      "ERC721Metadata: URI query for nonexistent token"
    );
  });

  it("set tokenURI check", async function () {
    await hardhatERC721.connect(owner).mint(meta1);
    await hardhatERC721.connect(owner).setBaseURI(baseURL2);

    expect(await hardhatERC721.tokenURI(0)).to.equal(baseURL2 + meta1);
    expect(hardhatERC721.connect(user1).setBaseURI(baseURL2))
      .to.be.revertedWith(
      "function only for admin"
    ); 
  });

  it("admin role check", async function () {
    expect(hardhatERC721.connect(user1).setBaseURI(baseURL2))
      .to.be.revertedWith(
      "function only for admin"
    ); 
    expect(hardhatERC721.connect(user1).mint(meta1))
      .to.be.revertedWith(
      "function only for admin"
    ); 
  });

});