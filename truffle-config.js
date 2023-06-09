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
      host: "0.0.0.0",
      port: 7545,
      network_id: "5777" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.6.0",
    },
  },
};
