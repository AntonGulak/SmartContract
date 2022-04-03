import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { time } from "console";

describe("DAO contract", function () {

  let tokens: any;
  let DAO: any;
  let counter: any;

  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let DAOInitializer: SignerWithAddress;
  
  const day: number = 86400;
  const minQuorum: number = 75;
  const jsonAbi =    [ {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "val",
        "type": "uint256"
      }
    ],
    "name": "addCount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    }
   ];

  beforeEach(async function () {
    [user, user2, DAOInitializer] = await ethers.getSigners();

    let ERC20 = await ethers.getContractFactory("ERC20");
    tokens = await ERC20.connect(user).deploy(1000, "Crypton", "CRPTN");
    await tokens.deployed();

    let DAOcontract = await ethers.getContractFactory("DAO");
    DAO = await DAOcontract.connect(DAOInitializer).deploy(tokens.address, 3 * day, minQuorum);
    await DAO.deployed();

    let Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.connect(user).deploy(DAO.address);
    await counter.deployed();

   });

  it("constructor check", async function () {
    expect((await DAO.settingsDAO()).tokensAddress).to.equal(tokens.address);
    expect((await DAO.settingsDAO()).minQuorumPercentage).to.equal(minQuorum);
    expect((await DAO.settingsDAO()).voitingTime).to.equal(3 * day);

    let DAOcontract = await ethers.getContractFactory("DAO");
    expect(DAOcontract.deploy(tokens.address, 3 * day, 110))
      .to.be.revertedWith(
      "percentage must be less than 100"
    );
  });

//   it("deposit check", async function () {
//     expect(DAO.connect(user)
//       .deposit(100)).to.be.revertedWith(
//       "error approve"
//     );
//     await tokens.connect(user).approve(DAO.address, 1100);
//     expect(DAO.connect(user)
//       .deposit(10000)).to.be.revertedWith(
//       "error balance"
//       );

//     await DAO.connect(user).deposit(100);
//     expect(await DAO.depositBalance(user.address)).to.equal(100);
//     expect(await tokens.balanceOf(user.address)).to.equal(900);
//     expect(await DAO.totalSupply()).to.equal(100);
//   });

//     it("withdrawDeposit check", async function () {
//       expect(DAO.connect(user)
//         .withdrawDeposit()).to.be.revertedWith(
//         "'you don`t have tokens on balance"
//       );

//       await tokens.connect(user).approve(DAO.address, 100);
//       await DAO.connect(user).deposit(100);
//       expect(await DAO.totalSupply()).to.equal(100);
//       expect(await DAO.depositBalance(user.address)).to.equal(100);
//       await DAO.connect(user).withdrawDeposit();

//       expect(await DAO.depositBalance(user.address)).to.equal(0);
//       expect(await DAO.totalSupply()).to.equal(0);
//       expect(await tokens.balanceOf(user.address)).to.equal(1000);

//       await tokens.connect(user).approve(DAO.address, 100);
//       await DAO.connect(user).deposit(100);
//       expect(await DAO.totalSupply()).to.equal(100);
//       expect(await DAO.depositBalance(user.address)).to.equal(100);

//       const iface = new ethers.utils.Interface(jsonAbi);
//       const calldata = iface.encodeFunctionData('addCount',[7]);
//       await DAO.connect(DAOInitializer).addProposal(counter.address, calldata, "ipfs/hash");
//       const blockNumAfter = await ethers.provider.getBlockNumber();
//       const blockAfter = await ethers.provider.getBlock(blockNumAfter);
//       const timestamp = blockAfter.timestamp;

//       await DAO.connect(user).accept(counter.address, calldata, timestamp);
//       await expect(DAO.connect(user)
//         .withdrawDeposit()).to.be.revertedWith(
//         "you don`t have rights to withdraw deposit"
//       );

//       await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
//       await ethers.provider.send("evm_mine", []);

    
//       await DAO.connect(user).withdrawDeposit();
//       expect(await DAO.depositBalance(user.address)).to.equal(0);
//       expect(await DAO.totalSupply()).to.equal(0);
//       expect(await tokens.balanceOf(user.address)).to.equal(1000);
//     });

//     it("addProposal check", async function () {
//       const iface = new ethers.utils.Interface(jsonAbi);
//       const calldata = iface.encodeFunctionData('addCount',[7]);

//       await expect(DAO.connect(user).addProposal(
//         counter.address, calldata, "ipfs/hash")).to.be.revertedWith(
//         "only for chairman"
//       );
//       await expect(DAO.connect(DAOInitializer).addProposal(
//         counter.address, calldata, "ipfs/hash"))
//         .to.emit(DAO, "AddProposal")
//         .withArgs(counter.address, calldata, "ipfs/hash"
//      );

//      const blockNumAfter = await ethers.provider.getBlockNumber();
//      const blockAfter = await ethers.provider.getBlock(blockNumAfter);
//      const timestamp = blockAfter.timestamp;

//      const msg = ethers.utils.solidityKeccak256(
//       ["address", "bytes", "uint256"],
//       [counter.address, calldata, timestamp]
//     );

//     expect((await DAO.getProposalInfo(msg)).accepted).to.equal(0);
//     expect((await DAO.getProposalInfo(msg)).rejected).to.equal(0);
//     });

//     it("accept check", async function () {
//       const iface = new ethers.utils.Interface(jsonAbi);
//       const calldata = iface.encodeFunctionData('addCount',[7]);

//       await DAO.connect(DAOInitializer).addProposal(counter.address, calldata, "ipfs/hash");

//       const blockNumAfter = await ethers.provider.getBlockNumber();
//       const blockAfter = await ethers.provider.getBlock(blockNumAfter);
//       const timestamp = blockAfter.timestamp;

//       const msg = ethers.utils.solidityKeccak256(
//         ["address", "bytes", "uint256"],
//         [counter.address, calldata, timestamp]
//       );

//       await tokens.connect(user).approve(DAO.address, 100);
//       await DAO.connect(user).deposit(100);
  
//       await expect(DAO.connect(user).accept(
//         counter.address, calldata, timestamp))
//         .to.emit(DAO, "Accept")
//         .withArgs(counter.address, calldata, timestamp, user.address
//       );
//       expect((await DAO.getProposalInfo(msg)).accepted).to.equal(100);
//       expect(DAO.connect(user)
//         .accept(counter.address, calldata, timestamp)).to.be.revertedWith(
//         "you already voted"
//       );
//       expect(DAO.connect(user)
//         .reject(counter.address, calldata, timestamp)).to.be.revertedWith(
//         "you already voted"
//       );

//       await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
//       await ethers.provider.send("evm_mine", []);

//       expect(DAO.connect(user)
//         .accept(counter.address, calldata, timestamp)).to.be.revertedWith(
//         "proposal is finished"
//      );
//     });

//     it("reject check", async function () {
//       const iface = new ethers.utils.Interface(jsonAbi);
//       const calldata = iface.encodeFunctionData('addCount',[7]);

//       await DAO.connect(DAOInitializer).addProposal(counter.address, calldata, "ipfs/hash");

//       const blockNumAfter = await ethers.provider.getBlockNumber();
//       const blockAfter = await ethers.provider.getBlock(blockNumAfter);
//       const timestamp = blockAfter.timestamp;

//       const msg = ethers.utils.solidityKeccak256(
//         ["address", "bytes", "uint256"],
//         [counter.address, calldata, timestamp]
//       );

//       await tokens.connect(user).approve(DAO.address, 100);
//       await DAO.connect(user).deposit(100);
//       await expect(DAO.connect(user).reject(
//         counter.address, calldata, timestamp))
//         .to.emit(DAO, "Reject")
//         .withArgs(counter.address, calldata, timestamp, user.address
//       );
//       expect((await DAO.getProposalInfo(msg)).rejected).to.equal(100);
//       expect(DAO.connect(user)
//         .reject(counter.address, calldata, timestamp)).to.be.revertedWith(
//         "you already voted"
//       );
//       expect(DAO.connect(user)
//         .accept(counter.address, calldata, timestamp)).to.be.revertedWith(
//         "you already voted"
//       );

//       await tokens.connect(user).transfer(user2.address, 100);
//       await tokens.connect(user2).approve(DAO.address, 100);
//       await DAO.connect(user2).deposit(100);
//       await DAO.connect(user2).accept(counter.address, calldata, timestamp);
      
//       expect((await DAO.getProposalInfo(msg)).accepted).to.equal(100);
//       expect((await DAO.getProposalInfo(msg)).rejected).to.equal(100);

//       await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
//       await ethers.provider.send("evm_mine", []);

//       expect(DAO.connect(user)
//         .reject(counter.address, calldata, timestamp)).to.be.revertedWith(
//         "proposal is finished"
//      );
//     });

//     it("finishProposal check with error minimum quorum", async function () {
//       const iface = new ethers.utils.Interface(jsonAbi);
//       const calldata = iface.encodeFunctionData('addCount',[7]);

//       await DAO.connect(DAOInitializer).addProposal(counter.address, calldata, "ipfs/hash");
//       const blockNumAfter = await ethers.provider.getBlockNumber();
//       const blockAfter = await ethers.provider.getBlock(blockNumAfter);
//       const timestamp = blockAfter.timestamp;

//       const msg = ethers.utils.solidityKeccak256(
//         ["address", "bytes", "uint256"],
//         [counter.address, calldata, timestamp]
//       );

//       await expect(DAO.connect(user)
//         .finishProposal(counter.address, calldata, timestamp)).to.be.revertedWith(
//         "proposal isn't finished"
//       );

//       await expect(DAO.connect(user)
//         .finishProposal(counter.address, calldata, 0)).to.be.revertedWith(
//         "proposal isn't activated"
//       );

//       await tokens.connect(user).approve(DAO.address, 100);
//       await DAO.connect(user).deposit(100);

//       await tokens.connect(user).transfer(user2.address, 200);
//       await tokens.connect(user2).approve(DAO.address, 200);
//       await DAO.connect(user2).deposit(200);

//       await DAO.connect(user).accept(counter.address, calldata, timestamp);

//       await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
//       await ethers.provider.send("evm_mine", []);

//       await expect(DAO.connect(user).finishProposal(
//         counter.address, calldata, timestamp))
//         .to.emit(DAO, "FinishProposal")
//         .withArgs(counter.address, calldata, timestamp, false
//      );
    
//     });

//       it("finishProposal check  < 50% + 1", async function () {
//         const iface = new ethers.utils.Interface(jsonAbi);
//         const calldata = iface.encodeFunctionData('addCount',[7]);
  
//         await DAO.connect(DAOInitializer).addProposal(counter.address, calldata, "ipfs/hash");
//         const blockNumAfter = await ethers.provider.getBlockNumber();
//         const blockAfter = await ethers.provider.getBlock(blockNumAfter);
//         const timestamp = blockAfter.timestamp;
  
//         const msg = ethers.utils.solidityKeccak256(
//           ["address", "bytes", "uint256"],
//           [counter.address, calldata, timestamp]
//         );
  
//         await expect(DAO.connect(user)
//           .finishProposal(counter.address, calldata, timestamp)).to.be.revertedWith(
//           "proposal isn't finished"
//         );
  
//         await expect(DAO.connect(user)
//           .finishProposal(counter.address, calldata, 0)).to.be.revertedWith(
//           "proposal isn't activated"
//         );
  
//         await tokens.connect(user).approve(DAO.address, 101);
//         await DAO.connect(user).deposit(101);
  
//         await tokens.connect(user).transfer(user2.address, 200);
//         await tokens.connect(user2).approve(DAO.address, 200);
//         await DAO.connect(user2).deposit(200);
  
//         await DAO.connect(user).accept(counter.address, calldata, timestamp);
//         await DAO.connect(user2).reject(counter.address, calldata, timestamp);
  
//         await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
//         await ethers.provider.send("evm_mine", []);
//         await expect(DAO.connect(user).finishProposal(
//           counter.address, calldata, timestamp))
//           .to.emit(DAO, "FinishProposal")
//           .withArgs(counter.address, calldata, timestamp, false
//        );

//         expect(await counter.counter()).to.equal(0);
//     });

//     it("finishProposal check  > 50% + 1", async function () {
//       const iface = new ethers.utils.Interface(jsonAbi);
//       const calldata = iface.encodeFunctionData('addCount',[7]);

//       await DAO.connect(DAOInitializer).addProposal(counter.address, calldata, "ipfs/hash");
//       const blockNumAfter = await ethers.provider.getBlockNumber();
//       const blockAfter = await ethers.provider.getBlock(blockNumAfter);
//       const timestamp = blockAfter.timestamp;

//       const msg = ethers.utils.solidityKeccak256(
//         ["address", "bytes", "uint256"],
//         [counter.address, calldata, timestamp]
//       );

//       await expect(DAO.connect(user)
//         .finishProposal(counter.address, calldata, timestamp)).to.be.revertedWith(
//         "proposal isn't finished"
//       );

//       await expect(DAO.connect(user)
//         .finishProposal(counter.address, calldata, 0)).to.be.revertedWith(
//         "proposal isn't activated"
//       );

//       await tokens.connect(user).approve(DAO.address, 101);
//       await DAO.connect(user).deposit(101);

//       await tokens.connect(user).transfer(user2.address, 200);
//       await tokens.connect(user2).approve(DAO.address, 200);
//       await DAO.connect(user2).deposit(200);

//       await DAO.connect(user).accept(counter.address, calldata, timestamp);
//       await DAO.connect(user2).accept(counter.address, calldata, timestamp);

//       await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
//       await ethers.provider.send("evm_mine", []);
//       await expect(DAO.connect(user).finishProposal(
//         counter.address, calldata, timestamp))
//         .to.emit(DAO, "FinishProposal")
//         .withArgs(counter.address, calldata, timestamp, true
//       );

//       expect(await counter.counter()).to.equal(7);
//   });

//   it("finishProposal with bad signature", async function () {
//     const json2Abi =    [ {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "val",
//           "type": "uint256"
//         }
//       ],
//       "name": "adddCount",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//       }
//     ];
//     const iface = new ethers.utils.Interface(json2Abi);
//     const calldata = iface.encodeFunctionData('adddCount',[7]);

//     await DAO.connect(DAOInitializer).addProposal(counter.address, calldata, "ipfs/hash");
//     const blockNumAfter = await ethers.provider.getBlockNumber();
//     const blockAfter = await ethers.provider.getBlock(blockNumAfter);
//     const timestamp = blockAfter.timestamp;

//     await tokens.connect(user).approve(DAO.address, 101);
//     await DAO.connect(user).deposit(101);

//     await tokens.connect(user).transfer(user2.address, 200);
//     await tokens.connect(user2).approve(DAO.address, 200);
//     await DAO.connect(user2).deposit(200);

//     await DAO.connect(user).accept(counter.address, calldata, timestamp);
//     await DAO.connect(user2).accept(counter.address, calldata, timestamp);

//     await ethers.provider.send("evm_increaseTime", [3 * day + 1]);
//     await ethers.provider.send("evm_mine", []);

//     await expect(DAO.connect(user).finishProposal(
//       counter.address, calldata, timestamp))
//       .to.be.revertedWith(
//         "ERROR call fun"
//     );
// });

});
