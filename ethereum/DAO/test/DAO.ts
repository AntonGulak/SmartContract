import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("DAO contract", function () {

  let tokens: any;
  let DAO: any;
  let counter: any;

  let user: SignerWithAddress;
  let chairman1: SignerWithAddress;
  let chairman2: SignerWithAddress;
  let chairman3: SignerWithAddress;
  let DAOInitializer: SignerWithAddress;
  
  const day: number = 86400;

  beforeEach(async function () {
    [user, DAOInitializer, chairman1, chairman2, chairman3] = await ethers.getSigners();

    let ERC20 = await ethers.getContractFactory("ERC20");
    tokens = await ERC20.connect(user).deploy(1000, "Crypton", "CRPTN");
    await tokens.deployed();

    let DAOcontract = await ethers.getContractFactory("DAO");
    DAO = await DAOcontract.connect(DAOInitializer).deploy(tokens.address, 3 * day, 75);
    await DAO.deployed();

    let Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.connect(user).deploy(DAO.address);
    await counter.deployed();

   });

  it("constructor check", async function () {

    // expect(await DAO.tokensAddress()).to.equal(tokens.address);
  });

  it("deposit check", async function () {
    expect(DAO.connect(user)
      .deposit(100)).to.be.revertedWith(
      "error approve"
      );

    await tokens.connect(user).approve(DAO.address, 1100);
    expect(DAO.connect(user)
      .deposit(10000)).to.be.revertedWith(
      "error balance"
      );

    await DAO.connect(user).deposit(100);
    expect(await DAO.depositBalance(user.address)).to.equal(100);
    expect(await tokens.balanceOf(user.address)).to.equal(900);
  });

    it("withdrawDeposit check", async function () {
      expect(DAO.connect(user)
        .withdrawDeposit()).to.be.revertedWith(
        "'you don`t have tokens on balance"
      );

      await tokens.connect(user).approve(DAO.address, 100);
      await DAO.connect(user).deposit(100);
      await ethers.provider.send("evm_increaseTime", [1200]);
      await ethers.provider.send("evm_mine", []);
      await DAO.connect(user).withdrawDeposit();

      expect(await DAO.depositBalance(user.address)).to.equal(0);
      expect(await tokens.balanceOf(user.address)).to.equal(1000);
    });

    // it("call check", async function () {
    //   let jsonAbi =    [ {
    //     "inputs": [
    //       {
    //         "internalType": "uint256",
    //         "name": "val",
    //         "type": "uint256"
    //       }
    //     ],
    //     "name": "addCount",
    //     "outputs": [],
    //     "stateMutability": "nonpayable",
    //     "type": "function"
    //     }
    //    ];
    //    const iface = new ethers.utils.Interface(jsonAbi);
    //    const calldata = iface.encodeFunctionData('addCount',[7]);
       
    //   await DAO.connect(user).callBySignature(counter.address, calldata);
    // });



  
});
