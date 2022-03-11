require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require('dotenv').config();
require("./tasks/donationsTasks.js")

module.exports = {
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_KEY}`
  },
  solidity: {
    version: "0.7.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
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

