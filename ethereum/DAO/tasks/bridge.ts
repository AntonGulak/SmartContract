
task("swap", "Get tokens")
.addParam("contract", "The bridge contract's address")
.addParam("tokenAddress", "Address of tokens  on current network")
.addParam("amount", "Amount of tokens")
.addParam("toChainId", "recipient by chain id")
.addParam("symbol", "symbol of tokens")
.addParam("nonce", "nonce")
.setAction(async (taskArgs, hre) => {
    const {contract, tokenAddress, amount, toChainId, symbol, nonce} = taskArgs;
    let Bridge = await ethers.getContractFactory("Bridge");
    let bridge = await Bridge.attach(contract);

    await bridge.swap(tokenAddress, amount, toChainId, symbol, nonce);
});

task("redeem", "Get tokens")
    .addParam("contract", "The bridge contract's address")
    .addParam("tokenAddress", "Address of tokens  on current network")
    .addParam("amount", "Amount of tokens")
    .addParam("fromChainId", "Chain id  where tokens came from")
    .addParam("symbol", "symbol of tokens")
    .addParam("nonce", "nonce")
    .addParam("v", "v")
    .addParam("r", "r")
    .addParam("s", "s")
    .setAction(async (taskArgs, hre) => {
        const {contract, tokenAddress, amount, fromChainId, symbol, nonce, v, r, s} = taskArgs;
        let Bridge = await ethers.getContractFactory("Bridge");
        let bridge = await Bridge.attach(contract);

        await bridge.redeem(tokenAddress, amount, fromChainId, symbol, nonce, v, r, s);
    });