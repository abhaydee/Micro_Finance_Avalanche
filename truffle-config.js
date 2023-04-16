const path = require("path");
require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = process.env.MNEMONIC;
const ROPSTEN_URL = process.env.ROPSTEN_URL;
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "localhost", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*",
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/390199995bf6477fbfd470a4e07722ed")
      },
      network_id: '5', // eslint-disable-line camelcase
      gas: 4465030,
      from: "0x8114cB34FFA92268FAeDc31493eae0e450a1ee13",
      gasPrice: 10000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.6.0",
    },
  },
};
