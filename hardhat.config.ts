import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

require("hardhat-deploy");
require("hardhat-deploy-ethers");
import "./tasks/accounts";
import "./tasks/clean";
// import "./tasks/deployers";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  col: 1515,
};

// Ensure that we have all the environment variables we need.
var mnemonic: string | undefined = process.env.MNEMONIC;
mnemonic = "test test test test test test test test test test test junk";
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

var infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
infuraApiKey = "bdae7d6d8029490fa7ca1c55bdf6c36b";
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url: string = "https://rinkeby-light.eth.linkpool.io/";//https://" + network + ".infura.io/v3/" + infuraApiKey;
  return {
    accounts: {
      count: 10,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    initialBaseFeePerGas: 0,
    chainId: 1515,//chainIds[network],
    // url: "https://rinkeby-light.eth.linkpool.io/",
    url: "http://47.105.67.39:8545/",
    //url,
    
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      initialBaseFeePerGas: 0,
    },
    goerli: getChainConfig("goerli"),
    kovan: getChainConfig("kovan"),
    rinkeby: getChainConfig("rinkeby"),
    ropsten: getChainConfig("ropsten"),
    col: getChainConfig("col"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.1",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  mocha:{
    timeout: 2000000,
  }
};

export default config;
