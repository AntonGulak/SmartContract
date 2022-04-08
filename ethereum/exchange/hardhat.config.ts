import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import '@nomiclabs/hardhat-ethers';
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import * as dotenv from "dotenv";
import "./tasks/bridge";

dotenv.config();

const config: HardhatUserConfig  = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      gasPrice: 20000000000,
      gas: 6000000,
      accounts: 
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        blockGasLimit: 10000000040000029720
    }
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_KEY}`
  },
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  }
}

export default config;
