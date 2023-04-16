const Proxy = artifacts.require("Proxy");
const Wallet = artifacts.require("Wallet");
const LoanManager = artifacts.require("LoanManager");
const HeartToken = artifacts.require("HeartToken");
const LoanDB = artifacts.require("LoanDB");

module.exports = async function (deployer) {
  await deployer.deploy(Proxy);

  //Database
  await deployer.deploy(LoanDB);
  await deployer.deploy(HeartToken);
  //Modules
  await deployer.deploy(Wallet);
  await deployer.deploy(LoanManager);

  this.proxy = await Proxy.deployed();
  this.loanDB = await LoanDB.deployed();
  this.heartToken = await HeartToken.deployed();
  this.wallet = await Wallet.deployed();
  this.loanManager = await LoanManager.deployed();

  await this.proxy.addContract("LoanManager", this.loanManager.address);
  await this.proxy.addContract("LoanDB", this.loanDB.address);
  await this.proxy.addContract("Wallet", this.wallet.address);
  await this.proxy.addContract("HeartToken", this.heartToken.address);

  await this.loanDB.setContainerEntry(this.proxy.address);
  await this.heartToken.setContainerEntry(this.proxy.address);
  await this.wallet.setContainerEntry(this.proxy.address);
  await this.loanManager.setContainerEntry(this.proxy.address);

  await this.loanManager.init();
};
