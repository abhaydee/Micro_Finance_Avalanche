# DeMicroFi - Decentralized Micro Finance Loan

DAPP that facilitates Loan Process, no-required third party based on Ethereum Network. It has a mechanism to incentive good behaviour by giving users heart token which can be used to redeem coupon.

[DeMicroFi Pitch Presentation](https://docs.google.com/presentation/d/1Up03UQDhnzcpt6XXtjx077o3Sz65pFXo1GZjuVaEO8A/edit#slide=id.g229f8369c8a_0_334)

## Authors
Authors: Abhay Deshpande and Teja Narasimha Reddy.

Email : deshpande.abh@northeastern.edu, larrymowa@gmail.com


## Problem Statement

* Micro financing through blockchain using Avalanche  can provide a revolutionary solution for refugees who struggle to make a living without proper identification, which makes it difficult for them to access traditional banking services. With Avalanche's fast and secure blockchain technology, refugees can obtain micro loans without the need for collateral or a credit history, empowering them to start small businesses and become financially independent. * This innovative approach to financing can significantly improve the lives of refugees and support their journey towards self-sustainability. By deploying Avalanche's blockchain, the lending process becomes transparent, secure and highly efficient, enabling lenders and borrowers to transact directly and transparently without the need for intermediaries. This technology also ensures that funds are distributed equitably, without the risk of corruption or misappropriation.
* Overall, micro financing through blockchain using Avalanche has the potential to be a powerful tool for social and economic empowerment, enabling refugees to build better lives for themselves and their communities.

## Proposed Solution

The emergence of Blockchain is a key to solve any intermediary-related problem. Lenders and Borrowers can communicate directly, all loan transactions are stored in immutable database.
The comparision of non-Blockchain and Blockchain solution :
| Non-Blockchain | Blockchain |
|----------------|------------|
| Expensive traditional audit process | Small amount of money for gas fee |
| Truthless intermediary company | No need third party |
| Transactions can be manipulated | Tranparent and secure transactions|

## DApp Architecture Design

### Technology

FrontEnd : React.JS, Javascript, Redux, Metamask, Core Wallet Extension, ThirdWeb SDK's

Smart Contract : Solidity

On Chain Database : Avalanche Blockchain
Off Chain Database : Firebase



#### Request Loan

![](./documentation/image/sequenceRequest.png)

#### Lend Loan

![](./documentation/image/sequenceLend.png)

#### Pay Loan

![](./documentation/image/sequencePayment.png)

#### Redeem coupon

![](./documentation/image/sequenceRedeem.png)

## Data Storage

### On-Chain

- `LoanDB.sol`
  | Name | Type | Structure | Visibility | Purpose |
  |---------------|---------------|-------------------|-------------------|-----------|
  | `debt` | struct |{ address lender; address borrower;uint256 amountOfDebt;uint256 interest; uint8 loanState;} | N/A | Structure to store debt details |
  | `LoanState` | enum | {REQUESTED, FUNDED, PAID} | N/A | State of loan |
  | `debtInfo` | mapping | (bytes32 debtID=> debt) | private | mapping of debtID with the debt struct |
  | `debtHistory` | mapping | (address borrower => bytes32[] debtID) | private | mapping of borrower with debtID list |
  | `lendHistory` | mapping | (address lender => bytes32[] debtID) | private | mapping of lender with debtID list |
  | `haveDebt` | mapping | (address user => bool haveDebt) | private | checking user is having debt or not |

- `Wallet.sol`
  | Name | Type | Structure | Visibility | Purpose |
  |---------------|---------------|-------------------|-------------------|-----------|
  | `_deposits`| mapping | (address user => uint256 amount) | private | the amount of money that user has|

### Off-chain

All user information and debt details are stored in Firebase Database.

**/infor**

- name.
- address.
- phone.
- userAddr.

**/debt**

- amount.
- borrower.
- debtNo.
- reason.

**/coupon**

- product.
- productCode.
- userAddr.

## Smart Contract Architecture Design

### DeMicroFi contracts was designed based on upgradable pattern.

![](./documentation/image/upgradablePattern.png)

### DeMicroFi contracts

![](./documentation/image/contractarchitecture.png)

### Deployments

Network : Avalanche C1 FUJI TestNet

Deployed and Published Contract Addresses with ThirdWeb on , FUJI TestNet Network: [Link](https://thirdweb.com/0x56Fa4e35bA598B423ACe534891594266F06F16E3)

## Future Goals

- [x] Blockchain

  - [x] Implemented contracts structure that can be upgraded.
  - [x] Write Test Cases for Each Smart Contract
  - [x] Incorporate all the functionalities into the frontend

- [ ] Front-end

  - [x] Finished necessary pages.
  - [x] Created better responsive pages for mobile and tablet.
  - [ ] Test cases for Front-end.

- [ ] Back-end

  - [x] Scaling the data properly using Firebase Tools
  - [x] Able to secure and efficiently store data on Firebase
  - [ ] Switch centralized database (Firebase) to decentralized database (IPFS).



