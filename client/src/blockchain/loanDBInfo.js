import Web3 from "web3";
import LoanDBContract from "../contracts/LoanDB.json";
const web3 = new Web3(window.web3.currentProvider);
const address = "0xc433f112b52e356A1EA5817fb4a191ad950567a7";
const ABI = LoanDBContract.abi;

export default new web3.eth.Contract(ABI, address);
