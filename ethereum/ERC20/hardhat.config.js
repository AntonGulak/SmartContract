require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require('dotenv').config();
require("./tasks/ERC20Tasks.js")

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    }
    // rinkeby: {
    //   url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
    //   accounts: [process.env.PRIVATE_KEY]
    // }
  },
  // etherscan: {
  //   apiKey: `${process.env.ETHERSCAN_KEY}`
  // },
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000000
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    tasks: "./tasks"
  }
}

