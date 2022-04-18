import { expect } from 'chai';
import { BigNumber, constants, utils } from "ethers";
import { ethers, network} from 'hardhat';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { IUniswapV2Router02, 
         IUniswapV2Factory, 
         IUniswapV2Pair,
         ERC20,
         UniswapAdapter } from '../typechain-types'


const ADDRESS_NULE = "0x0000000000000000000000000000000000000000";

describe("Testing uniswap adapter", () =>{
    let router : IUniswapV2Router02;
    let factory : IUniswapV2Factory;
    let uniswapAdapter: UniswapAdapter;
    let pairTST_ACDM : IUniswapV2Pair;
    let pairACDM_POP : IUniswapV2Pair;

    let tokenTST : ERC20;
    let tokenACDM : ERC20;
    let tokenPOP : ERC20;

    let trader: SignerWithAddress;
    let service: SignerWithAddress;


    async function getCurrentTime(){
        return (
          await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
        ).timestamp;
    }
    
    before(async () => {

        [trader, service] = await ethers.getSigners();
        console.log(trader);
        let UniswapAdapter = await ethers.getContractFactory("UniswapAdapter");
        uniswapAdapter = <UniswapAdapter>(await UniswapAdapter.deploy(
            process.env.ROUTER_ADDRESS, 
            process.env.FACTORY_ADDRESS)
        );
        await uniswapAdapter.deployed();
      
        const Token = await ethers.getContractFactory("ERC20");
        tokenTST = <ERC20>(await Token.deploy(
            "TST",
            "TST",
            ethers.utils.parseUnits("1000000", ethers.BigNumber.from(18) )
        ));
        await tokenTST.deployed();
        console.log(tokenTST.address)
      
        tokenACDM = <ERC20>(await Token.deploy(
            "ACDM",
            "ACDM",
            ethers.utils.parseUnits("1000000", ethers.BigNumber.from(18) )
        ));
        await tokenACDM.deployed();
        console.log(tokenACDM.address);
      
        tokenPOP = <ERC20>(await Token.deploy(
            "POP",
            "POP",
            ethers.utils.parseUnits("1000000", ethers.BigNumber.from(18) )
        ));
        console.log(tokenPOP.address);
      
        router = <IUniswapV2Router02>(
            await ethers.getContractAt(
                "IUniswapV2Router02",
                process.env.ROUTER_ADDRESS as string)
        );
        factory = <IUniswapV2Factory>(
            await ethers.getContractAt(
                "IUniswapV2Factory",
                process.env.FACTORY_ADDRESS as string)
        );
    });

    it("constructor check", async () => {
        expect(await uniswapAdapter.ROUTER_ADDRESS()).to.equal(process.env.ROUTER_ADDRESS);
        expect(await uniswapAdapter.FACTORY_ADDRESS()).to.equal(process.env.FACTORY_ADDRESS);
    });

    it("create pair", async () => {
        await uniswapAdapter.createPair(tokenTST.address, tokenACDM.address);
        await uniswapAdapter.createPair(tokenACDM.address, tokenPOP.address);

        expect(await factory.getPair(tokenTST.address, tokenACDM.address)).to.not.equal(ADDRESS_NULE);
        expect(await factory.getPair(tokenACDM.address, tokenPOP.address)).to.not.equal(ADDRESS_NULE);

        pairTST_ACDM = <IUniswapV2Pair>(
            await ethers.getContractAt(
              "IUniswapV2Pair",
              await factory.getPair(tokenTST.address, tokenACDM.address)
            )
        );

        pairACDM_POP = <IUniswapV2Pair>(
            await ethers.getContractAt(
              "IUniswapV2Pair",
              await factory.getPair(tokenACDM.address, tokenPOP.address)
            )
        );
    });

    it("addLiquidity check", async () => {
        await tokenTST.approve(uniswapAdapter.address, ethers.utils.parseUnits("1000", ethers.BigNumber.from(18)));
        await tokenACDM.approve(uniswapAdapter.address, ethers.utils.parseUnits("1000", ethers.BigNumber.from(18)));
        const sum = ethers.utils.parseUnits("1000", ethers.BigNumber.from(18));
        await uniswapAdapter.addLiquidity(
            tokenTST.address,
            tokenACDM.address,
            sum,
            sum,
            sum,
            sum,
            trader.address,
            await getCurrentTime() + 1000
        );
        expect((await pairTST_ACDM.getReserves()).reserve0).to.equal(sum);
        expect((await pairTST_ACDM.getReserves()).reserve1).to.equal(sum);
    });

    it("addLiquidity WETH check", async () => {
        await tokenPOP.approve(uniswapAdapter.address, ethers.utils.parseUnits("1000", ethers.BigNumber.from(18)));
        const sum = ethers.utils.parseUnits("1000", ethers.BigNumber.from(18));

        await router.addLiquidityETH(
            tokenPOP.address,
            sum,
            0,
            ethers.utils.parseEther("0.00001"),
            trader.address,
            await getCurrentTime() + 1000,
            { value: ethers.utils.parseEther("0.00001") }
        );
        let pairPOP_WETH = <IUniswapV2Pair>(
            await ethers.getContractAt(
              "IUniswapV2Pair",
              await factory.getPair(tokenPOP.address, process.env.WETH_ADDRESS as string)
            )
        );
        expect((await pairPOP_WETH.getReserves()).reserve0).to.equal(sum);
    });


    it("getPrice check", async () => {
        expect(await uniswapAdapter.getPrice(1, tokenTST.address, tokenACDM.address)).to.equal(2);
    });

    it("swap check", async () => {
        await uniswapAdapter.swap(
            1000000,
            50,
            tokenTST.address,
            tokenACDM.address,
            uniswapAdapter.address,
            await getCurrentTime() + 1000
          );

        expect((await tokenTST.balanceOf(uniswapAdapter.address))).to.not.equal(0);
    });

    it("swap via router check", async () => {
        await router.swapExactTokensForTokens(
            1000000,
            50,
            [String(tokenTST.address), String(tokenPOP.address)],
            uniswapAdapter.address,
            await getCurrentTime() + 1000
          );
    });

    it("removeLiquidity check", async () => {
        await pairTST_ACDM.approve(
            uniswapAdapter.address,
            ethers.utils.parseUnits("1000", ethers.BigNumber.from(18))
        );
        await uniswapAdapter.removeLiquidity(
            tokenTST.address,
            tokenACDM.address,
            await pairTST_ACDM.balanceOf(trader.address),
            0,
            0,
            trader.address,
            await getCurrentTime() + 1000
        );
        expect(await pairTST_ACDM.balanceOf(trader.address)).to.eq(0);
    });
});