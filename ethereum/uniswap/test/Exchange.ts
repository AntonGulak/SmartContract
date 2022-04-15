import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("exchange contract", function () {


  let contractACDM: any;
  let exchange: any;
  let prov: any;

  let crypton: SignerWithAddress;
  let user0: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  let initTimeStamp: number;

  const addressNull: string = "0x0000000000000000000000000000000000000000";
  const initNumberTokens: number = 100000;
  const day: number = 86400;
  
  beforeEach(async function () {
    [crypton, user0, user1, user2, user3] = await ethers.getSigners();
    prov = ethers.getDefaultProvider();

    let Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.connect(crypton).deploy();
    await exchange.deployed();

    let ERC20 = await ethers.getContractFactory("ERC20");
    contractACDM = await ERC20.connect(crypton).deploy("Crypton Academy", "ACDM", exchange.address);
    await contractACDM.deployed();

    await exchange.connect(crypton).registerTokenFactory(contractACDM.address, initNumberTokens,  ethers.utils.parseEther('1'));
    const blockNumAfter = await ethers.provider.getBlockNumber();
    const blockAfter = await ethers.provider.getBlock(blockNumAfter);
    initTimeStamp = await blockAfter.timestamp;
   });

   it("registerTokenFactory check", async function () {
    expect(await contractACDM.balanceOf(exchange.address)).to.equal(initNumberTokens);
    await expect(exchange.connect(crypton)
      .registerTokenFactory(contractACDM.address, initNumberTokens,  ethers.utils.parseEther('1')))
      .to.be.revertedWith(
      'Token factory are already registered'
    );
    expect((await exchange.tokenAndRound()).addr).to.equal(contractACDM.address);
    expect(await exchange.tokenPrice()).to.equal(ethers.utils.parseUnits("1", 13));
    expect((await exchange.tokenAndRound()).startTime).to.equal(initTimeStamp + (initTimeStamp & 1));
    expect((await exchange.tokenAndRound()).startTime % 2).to.equal(0);

    await expect(exchange.connect(crypton)
      .startTradeRound())
      .to.be.revertedWith(
      "A round isn't finished"
    );

    await expect(exchange.connect(crypton)
      .startSaleRound())
      .to.be.revertedWith(
      "A round isn't finished"
    );
  });

  it("register check", async function () {
    await exchange.connect(user2).register(user3.address);
    await expect(exchange.connect(user2)
      .register(user1.address))
      .to.be.revertedWith(
      "You are already registered"
    );
    await exchange.connect(user1).register(user2.address);
    expect(await exchange.referrals(user1.address)).to.equal(user2.address);
    expect(await exchange.referrals(user2.address)).to.equal(user3.address);
  });

  it("buyTokenOnSaleRound check", async function () {
    await exchange.connect(user1).buyTokenOnSaleRound({
      value: ethers.utils.parseUnits("1", 16)
    });
    expect(await contractACDM.balanceOf(user1.address)).to.equal(1000);

    await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
    await ethers.provider.send("evm_mine", []);

    await expect(exchange.connect(user2)
      .buyTokenOnSaleRound({ value: ethers.utils.parseUnits("1", 16)}))
      .to.be.revertedWith(
      "A sale round is finished"
    );
    await expect(exchange.connect(crypton)
      .startSaleRound())
      .to.be.revertedWith(
      "You should start the trade round"
    );
  });

  it("finishSaleRoundPrematurely check", async function () {
    await expect(exchange.connect(user2)
      .finishSaleRoundPrematurely())
      .to.be.revertedWith(
      "You can not finish the sale round"
    );
    await exchange.connect(user1).buyTokenOnSaleRound({
      value: ethers.utils.parseUnits("1", 18)
    });

    await exchange.connect(user2).finishSaleRoundPrematurely();
    expect((await exchange.tokenAndRound()).startTime).to.equal(1);
    await expect(exchange.connect(user2)
      .startSaleRound())
      .to.be.revertedWith(
      "You should start the trade round"
    );
  });

  it("startTradeRound check", async function () {
    await exchange.connect(user1).buyTokenOnSaleRound({
      value: ethers.utils.parseUnits("1", 16)
    });
    await exchange.connect(user3).buyTokenOnSaleRound({
      value: ethers.utils.parseUnits("1", 16)
    });
    await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
    await ethers.provider.send("evm_mine", []);
    await exchange.connect(user2).startTradeRound();
    expect(await contractACDM.balanceOf(exchange.address)).to.equal(0);

    let blockNumAfter = await ethers.provider.getBlockNumber();
    let blockAfter = await ethers.provider.getBlock(blockNumAfter);
    let timeStamp = await blockAfter.timestamp;
    expect((await exchange.tokenAndRound()).startTime).to.equal(timeStamp | 1);
    await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
    await ethers.provider.send("evm_mine", []);
    expect(await exchange.totalSales()).to.equal(0);
    await expect(exchange.connect(user2)
      .startSaleRound())
      .to.be.revertedWith(
      "You should start the trade round"
    );
    await exchange.connect(user1).startTradeRound();
    await expect(exchange.connect(user2)
      .buyTokenOnSaleRound({ value: ethers.utils.parseUnits("1", 16)}))
      .to.be.revertedWith(
      "It is not a sale round"
    );
    await contractACDM.connect(user1).approve(exchange.address, 1000);
    await exchange.connect(user1).placeTokens(500, ethers.utils.parseUnits("5", 13))

    await contractACDM.connect(user3).approve(exchange.address, 1000);
    await exchange.connect(user3).placeTokens(500, ethers.utils.parseUnits("5", 13))

    await exchange.connect(user3).buyTokenOnTradeRound( user1.address, ethers.utils.parseUnits("5", 13), { value: ethers.utils.parseUnits("2.5", 16)});
    await expect(exchange.connect(user2)
      .finishSaleRoundPrematurely())
      .to.be.revertedWith(
      "It's not the sale round"
    );
    await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
    await ethers.provider.send("evm_mine", []);
    await expect(exchange.connect(user2)
      .startTradeRound())
      .to.be.revertedWith(
      "You should start the sale round"
    );
    await exchange.connect(user2).startSaleRound();
    expect(await contractACDM.balanceOf(user1.address)).to.equal(500);
    expect(await contractACDM.balanceOf(user3.address)).to.equal(1500);
    expect(await contractACDM.balanceOf(user2.address)).to.equal(0);
  });

  it("startSaleRound check", async function () {
    await exchange.connect(user1).buyTokenOnSaleRound({
      value: ethers.utils.parseUnits("1", 16)
    });
    await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
    await ethers.provider.send("evm_mine", []);
  
    await exchange.connect(user1).startTradeRound();
    await contractACDM.connect(user1).approve(exchange.address, 1000);
    await exchange.connect(user1).placeTokens(1000, ethers.utils.parseUnits("5", 13))
    await exchange.connect(user3).buyTokenOnTradeRound( user1.address, ethers.utils.parseUnits("5", 13), { value: ethers.utils.parseUnits("2.5", 16)});
      
    await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
    await ethers.provider.send("evm_mine", []);
    await exchange.connect(user2).startSaleRound();
    expect(await exchange.totalSales()).to.equal(0);
  });
  
  it("placeTokens check", async function () {
    await exchange.connect(user3).buyTokenOnSaleRound({
      value: ethers.utils.parseUnits("1", 16)
    });
   
    await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
    await ethers.provider.send("evm_mine", []);
    await exchange.connect(user3).startTradeRound();
    await contractACDM.connect(user3).approve(exchange.address, 1000);
    await exchange.connect(user3).placeTokens(500, ethers.utils.parseUnits("5", 13))
    expect((await exchange.tokenOfferByUsers(user3.address)).amount).to.equal(500);
    expect((await exchange.tokenOfferByUsers(user3.address)).price).to.equal(ethers.utils.parseUnits("5", 13));

    await exchange.connect(user3).placeTokens(400, ethers.utils.parseUnits("5", 13))
    expect((await exchange.tokenOfferByUsers(user3.address)).amount).to.equal(900);
    expect((await exchange.tokenOfferByUsers(user3.address)).price).to.equal(ethers.utils.parseUnits("5", 13));

    
    await exchange.connect(user3).placeTokens(100, ethers.utils.parseUnits("7", 13))
    expect((await exchange.tokenOfferByUsers(user3.address)).amount).to.equal(1000);
    expect((await exchange.tokenOfferByUsers(user3.address)).price).to.equal(ethers.utils.parseUnits("7", 13));
  });

  it("buyTokenOnTradeRound check", async function () {
    await exchange.connect(user3).buyTokenOnSaleRound({
      value: ethers.utils.parseUnits("1", 16)
    });
    await expect(exchange.connect(user2)
      .buyTokenOnTradeRound( user3.address, ethers.utils.parseUnits("5", 13), {value: ethers.utils.parseUnits("5", 16)} ))
      .to.be.revertedWith(
      "It is not a trade round"
    );
    await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
    await ethers.provider.send("evm_mine", []);

    await exchange.connect(user3).startTradeRound();

    await contractACDM.connect(user3).approve(exchange.address, 1000);
    await exchange.connect(user3).placeTokens(1000, ethers.utils.parseUnits("5", 13))

    expect(await contractACDM.balanceOf(exchange.address)).to.equal(1000);
    await expect(exchange.connect(user2)
        .buyTokenOnTradeRound( user3.address, ethers.utils.parseUnits("5", 17), {value: ethers.utils.parseUnits("5", 16)} ))
        .to.be.revertedWith(
        "The price is changed"
    );
    await exchange.connect(user1).buyTokenOnTradeRound( user3.address, ethers.utils.parseUnits("5", 13), { value: ethers.utils.parseUnits("2.5", 16)});
    await exchange.connect(user2).buyTokenOnTradeRound( user3.address, ethers.utils.parseUnits("5", 13), { value: ethers.utils.parseUnits("2.5", 16)});

    expect(await contractACDM.balanceOf(user1.address)).to.equal(500);
    expect(await contractACDM.balanceOf(user2.address)).to.equal(500);
  
    await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
    await ethers.provider.send("evm_mine", []);
    await expect(exchange.connect(user2)
      .buyTokenOnTradeRound( user3.address, ethers.utils.parseUnits("5", 13), {value: ethers.utils.parseUnits("5", 16)} ))
      .to.be.revertedWith(
      "A trade round is finished"
    );
  });


  it("withdrawByAdmin check", async function () {
    await expect(exchange.connect(user1)
      .withdrawByAdmin(user1.address))
      .to.be.revertedWith(
      "function only for admin"
    );
    await exchange.connect(crypton).withdrawByAdmin(crypton.address);
  });
});