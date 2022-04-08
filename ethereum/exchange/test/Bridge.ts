import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("exchange contract", function () {


  let contractACDM: any;
  let exchange: any;

  let crypton: SignerWithAddress;
  let user2: SignerWithAddress;

  const addressNull: string = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    [crypton, user2] = await ethers.getSigners();

    let Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.connect(crypton).deploy();
    await exchange.deployed();

    let ERC20 = await ethers.getContractFactory("ERC20");
    contractACDM = await ERC20.connect(crypton).deploy("Crypton Academy", "ACDM", exchange.address);
    await contractACDM.deployed();

    await exchange.connect(crypton).registerTokenFactory(contractACDM.address);
   });

   it("constructor check", async function () {
    //expect(await ethereumBridge.nodeValidator()).to.equal(validator.address);
  });

});