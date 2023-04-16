pragma solidity ^0.6.0;
import "../lib/SafeMath.sol";
import "../database/LoanDB.sol";
import "../database/HeartToken.sol";
import "../container/Contained.sol";
import "./Wallet.sol";


contract LoanManager is Contained {
    using SafeMath for uint256;
    enum LoanState {REQUESTED, FUNDED, PAID}
    event Requested(bytes32 debtNo, address _owner, uint256 _amount);
    event Funded(bytes32 debtNo, address _lender);
    event PaidBack(bytes32 debtNo);
    uint104 rewardToken = 10;
    LoanDB loandb;
    HeartToken heartToken;
    Wallet wallet;

    function init() external onlyOwner {
        loandb = LoanDB(container.getContract(CONTRACT_LOAN_DB));
        heartToken = HeartToken(payable(container.getContract(CONTRACT_HEART_TOKEN)));
        wallet = Wallet(container.getContract(CONTRACT_WALLET));
    }

    function setRewardToken(uint104 _amount) external onlyOwner {
        rewardToken = _amount;
    }

    function requestLoan(bytes32 _debtNo, address _borrower, uint256 _amount)
        external
        onlyContained
    {
        require(_amount >= 1e16 wei, "The amount is too small to borrow");
        require(loandb.getBorrowerofDebt(_debtNo) == address(0), "debt exists");
        require(loandb.checkHaveDebt(_borrower) == false,"already have Debt");
        uint256 _interest = (_amount.mul(2)).div(100);
        loandb.addDebt(_debtNo, _borrower, _amount, _interest);
        emit Requested(_debtNo, _borrower, _amount);
    }

    function lendLoan(bytes32 _debtNo, address _sender)
        external
        payable
        onlyContained
    {
        uint256 _amount = loandb.getAmountofDebt(_debtNo);
        address _borrower = loandb.getBorrowerofDebt(_debtNo);
        require(loandb.getStateofDebt(_debtNo) == uint(LoanState.REQUESTED),"Not in requested state");
        require(msg.value >= _amount, "Not enough amount");
        require(_borrower != address(0), "Debt is not existing");
        require(loandb.checkHaveDebt(_borrower) == false,"already have Debt");
        wallet.deposit.value(msg.value)(_borrower);
        loandb.updateLender(_debtNo, _sender);
        loandb.setHaveDebt(_borrower,true);
        heartToken.getToken(_sender, rewardToken);
        emit Funded(_debtNo, _sender);
    }

    function payLoan(bytes32 _debtNo, address _sender)
        external
        payable
        onlyContained
    {
        uint256 _amount = loandb.getAmountofDebt(_debtNo).add(
            loandb.getInterestofDebt(_debtNo)
        );
        require(msg.value >= _amount, "Not enough amount");
        require(_amount != 0, "Debt is not existing");
        require(loandb.getStateofDebt(_debtNo) == uint(LoanState.FUNDED),"Not in funded state");
        address _lender = loandb.getLenderofDebt(_debtNo);
        require(_lender != address(0), "Does not have lender");
        wallet.deposit.value(msg.value)(_lender);
        loandb.completeDebt(_debtNo);
        heartToken.getToken(_sender, rewardToken);
        loandb.setHaveDebt(_sender,false);
        emit PaidBack(_debtNo);
    }
}
