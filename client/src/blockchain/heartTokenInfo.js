import Web3 from "web3";
import HeartTokenContract from "../contracts/HeartToken.json";
const web3 = new Web3(window.web3.currentProvider);
const address = "0x1c9a901438CFe8b9Be686e7d8088E2E863194830";
const ABI = HeartTokenContract.abi;

export default new web3.eth.Contract(ABI, address);
