
task("addProposal", "")
.addParam("contract", "The DAO contract's address")
.addParam("recipient", "Recipient contract ")
.addParam("signature", "Signature for call")
.addParam("description", "Description")
.setAction(async (taskArgs, hre) => {
    const {contract, recipient, signature, description} = taskArgs;
    let contractDAO = await ethers.getContractFactory("DAO");
    let DAO = await contractDAO.attach(contract);

    await DAO.addProposal(recipient, signature, description);
});


task("accept", "")
.addParam("contract", "The DAO contract's address")
.addParam("recipient", "Recipient contract ")
.addParam("signature", "Signature for call")
.addParam("createTime", "Description")
.setAction(async (taskArgs, hre) => {
    const {contract, recipient, signature, createTime} = taskArgs;
    let contractDAO = await ethers.getContractFactory("DAO");
    let DAO = await contractDAO.attach(contract);

    await DAO.accept(recipient, signature, createTime);
});

task("reject", "")
.addParam("contract", "The DAO contract's address")
.addParam("recipient", "Recipient contract ")
.addParam("signature", "Signature for call")
.addParam("createTime", "Description")
.setAction(async (taskArgs) => {
    const {contract, recipient, signature, createTime} = taskArgs;
    let contractDAO = await ethers.getContractFactory("DAO");
    let DAO = await contractDAO.attach(contract);

    await DAO.reject(recipient, signature, createTime);
});

task("finishProposal", "")
.addParam("contract", "The DAO contract's address")
.addParam("recipient", "Recipient contract ")
.addParam("signature", "Signature for call")
.addParam("createTime", "Description")
.setAction(async (taskArgs) => {
    const {contract, recipient, signature, createTime} = taskArgs;
    let contractDAO = await ethers.getContractFactory("DAO");
    let DAO = await contractDAO.attach(contract);

    await DAO.finishProposal(recipient, signature, createTime);
});

task("deposit", "")
.addParam("contract", "The DAO contract's address")
.addParam("amount", "Amount of money to deposit")
.setAction(async (taskArgs) => {
    const {contract, amount} = taskArgs;
    let contractDAO = await ethers.getContractFactory("DAO");
    let DAO = await contractDAO.attach(contract);

    await DAO.deposit(amount);
});

