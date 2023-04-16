import Web3 from "web3";
import WalletContract from "../contracts/Wallet.json";
const web3 = new Web3(window.web3.currentProvider);
const address = "0x80EE439859Dd2035bB812196E0fDCCCd56520076";
const ABI = WalletContract.abi;

export default new web3.eth.Contract(ABI, address);
