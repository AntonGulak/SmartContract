const { expect } = require("chai")
const { ethers, waffle } = require("hardhat");

describe("Donations contract", function () {

  let Donations;
  let hardhatDonations;
  let owner;
  let user1;
  let user2;
  let user3;
  let provider;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    Donations = await ethers.getContractFactory("Donations");
    hardhatDonations = await Donations.deploy();
    await hardhatDonations.deployed();
    provider = waffle.provider;
   });

  it("is owned by published", async function () {
    expect(await hardhatDonations.owner()).to.equal(owner.address);
  });

  it("correct donate call", async function () {
    await hardhatDonations.connect(user1).donate({
      value: ethers.utils.parseEther("1.0")
    }); 
    expect(await provider.getBalance(hardhatDonations.address)).
      to.equal(ethers.utils.parseEther("1.0")
    );

    await hardhatDonations.connect(user2).donate({
      value: ethers.utils.parseEther("2.0")
    });
    expect(await provider.getBalance(hardhatDonations.address)).
      to.equal(ethers.utils.parseEther("3.0")
    );

    expect(hardhatDonations.connect(user2).
      donate()).to.be.revertedWith(
        "Amount must be greater than zero"
  );
  });

  it("correct balance amount", async function () {
    await hardhatDonations.connect(user1).donate({
      value: ethers.utils.parseEther("1.0")
    }); 
    expect(await hardhatDonations.balanceOf(user1.address)).
      to.equal(ethers.utils.parseEther("1.0")
    );

    await hardhatDonations.connect(user1).donate({
      value: ethers.utils.parseEther("3.0")
    }); 
    expect(await hardhatDonations.balanceOf(user1.address)).
      to.equal(ethers.utils.parseEther("4.0")
    );

    await hardhatDonations.connect(user2).donate({
      value: ethers.utils.parseEther("7.0")
    });
    expect(await hardhatDonations.balanceOf(user2.address)).
      to.equal(ethers.utils.parseEther("7.0")
    );

    expect(await hardhatDonations.balanceOf(user3.address)).
      to.equal(ethers.utils.parseEther("0")
    );
  });

  it("correct benefactors list", async function () {
    expect([]).to.eql(await hardhatDonations.showAllbenefactors());

    await hardhatDonations.connect(user1).donate({
      value: ethers.utils.parseEther("1.0")
    }); 
    await hardhatDonations.connect(user2).donate({
      value: ethers.utils.parseEther("7.0")
    });
    let benefactorsList = await hardhatDonations.showAllbenefactors();
    expect(benefactorsList).to.have.lengthOf(2); 
    expect(benefactorsList).to.have.members([user2.address,user1.address]);

    await hardhatDonations.connect(user1).donate({
      value: ethers.utils.parseEther("2.0")
    }); 
    expect(benefactorsList).to.eql(await hardhatDonations.showAllbenefactors());
  });

  it("onlyOwner modifier is correct", async function () {
    await hardhatDonations.connect(user1).donate({
      value: ethers.utils.parseEther("13.0")
    }); 
    await hardhatDonations.connect(owner).
      transfer(user3.address, ethers.utils.parseEther("1.0")
    );
   
    expect(await provider.getBalance(hardhatDonations.address)).
      to.equal(ethers.utils.parseEther("12.0")
    );
    expect(hardhatDonations.connect(user2).
      transfer(user3.address, ethers.utils.parseEther("1.0"))).to.be.revertedWith(
        "Function only for owner"
    );
  });

  it("correct transfer", async function () {
    await hardhatDonations.connect(user1).donate({
      value: ethers.utils.parseEther("13.0")
    }); 
    let initBalance = await provider.getBalance(user2.address);
    await hardhatDonations.connect(owner).
      transfer(user2.address, ethers.utils.parseEther("2.0")
    );
    let diff = await provider.getBalance(user2.address) - initBalance;
    let flag = false;
    if (Math.abs(ethers.utils.parseEther("2.0") - diff) > 0.0000001) {
      flag = true;
    }

    expect(flag).to.equal(true);
    expect(hardhatDonations.connect(user2).
      transfer(user3.address, ethers.utils.parseEther("10000.0"))).to.be.revertedWith(
        "Failed to send money"
        );
  });

});
