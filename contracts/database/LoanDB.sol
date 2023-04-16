// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lib/SafeMath.sol";
import "../container/Contained.sol";

/**
    @title LoanDB
    @dev Stores all the loan details.
    @author abhaydeshpande
 */
contract LoanDB is Contained {
    using SafeMath for uint256;
    enum LoanState {
    REQUESTED,
    FUNDED,
    PAID
}

struct Debt {
    address lender;
    address borrower;
    uint256 amountOfDebt;
    uint256 interest;
    uint8 loanState;
}

mapping(bytes32 => Debt) private debtInfo;
mapping(address => bytes32[]) private debtHistory;
mapping(address => bytes32[]) private lendHistory;
mapping(address => bool) private haveDebt;

function addDebt(
    bytes32 debtNo,
    address borrower,
    uint256 amountOfDebt,
    uint256 interest
) external onlyContract(CONTRACT_LOAN_MANAGER) {
    require(amountOfDebt > 0, "Invalid debt amount");
    require(interest > 0, "Invalid interest rate");

    Debt storage newDebt = debtInfo[debtNo];
    require(newDebt.amountOfDebt == 0, "Debt already exists");

    newDebt.borrower = borrower;
    newDebt.amountOfDebt = amountOfDebt;
    newDebt.interest = interest;
    newDebt.loanState = uint8(LoanState.REQUESTED);

    debtHistory[borrower].push(debtNo);
}

function updateLender(bytes32 debtNo, address lender)
    external
    onlyContract(CONTRACT_LOAN_MANAGER)
{
    require(lender != address(0), "Invalid lender address");

    Debt storage updatedDebt = debtInfo[debtNo];
    require(updatedDebt.amountOfDebt > 0, "Debt does not exist");
    require(
        updatedDebt.lender == address(0),
        "Lender is already assigned"
    );

    updatedDebt.lender = lender;
    updatedDebt.loanState = uint8(LoanState.FUNDED);

    lendHistory[lender].push(debtNo);
}

function completeDebt(bytes32 debtNo)
    external
    onlyContract(CONTRACT_LOAN_MANAGER)
{
    Debt storage completedDebt = debtInfo[debtNo];
    require(completedDebt.amountOfDebt > 0, "Debt does not exist");

    completedDebt.loanState = uint8(LoanState.PAID);
}

function setHaveDebt(address sender, bool state)
    external
    onlyContract(CONTRACT_LOAN_MANAGER)
{
    haveDebt[sender] = state;
}

function checkHaveDebt(address sender) external view returns (bool) {
    return haveDebt[sender];
}

function getLenderofDebt(bytes32 debtNo) external view returns (address) {
    return debtInfo[debtNo].lender;
}

function getBorrowerofDebt(bytes32 debtNo) external view returns (address) {
    return debtInfo[debtNo].borrower;
}

function getAmountofDebt(bytes32 debtNo) external view returns (uint256) {
    return debtInfo[debtNo].amountOfDebt;
}

function getInterestofDebt(bytes32 debtNo) external view returns (uint256) {
    return debtInfo[debtNo].interest;
}

function getStateofDebt(bytes32 debtNo) external view returns (uint8) {
    return debtInfo[debtNo].loanState;
}

function getDebtHistory(address _address)
    external
    view
    returns (bytes32[] memory)
{
    require(msg.sender == _address || msg.sender == owner, "Unauthorized access");

    return debtHistory[_address];
}

function getLendHistory(address _address)
    external
    view
    returns (bytes32[] memory)
{
    require(msg.sender == _address || msg.sender == owner, "Unauthorized access");

    return lendHistory[_address];
}}

   
