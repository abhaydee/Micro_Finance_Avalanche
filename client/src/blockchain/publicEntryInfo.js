import Web3 from "web3";
import ProxyContract from "../contracts/Proxy.json";
const web3 = new Web3(window.web3.currentProvider);
const address = "0x6a961cD4488CBCF843E9d2D26A4b8f79BdD1E0Bb";
const ABI = ProxyContract.abi;

export default new web3.eth.Contract(ABI, address);
