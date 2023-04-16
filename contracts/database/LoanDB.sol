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
    enum LoanState {REQUESTED, FUNDED, PAID}
    struct debt {
        address lender;
        address borrower;
        uint256 amountOfDebt;
        uint256 interest;
        uint8 loanState;
    }

    mapping(bytes32 => debt) private debtInfo;
    mapping(address => bytes32[]) private debtHistory;
    mapping(address => bytes32[]) private lendHistory;
    mapping(address => bool) private haveDebt;
    function addDebt(
        bytes32 debtNo,
        address _borrower,
        uint256 _amountOfDebt,
        uint256 _interest
    ) external onlyContract(CONTRACT_LOAN_MANAGER) {
        debtInfo[debtNo] = debt(
            address(0),
            _borrower,
            _amountOfDebt,
            _interest,
            uint8(LoanState.REQUESTED)
        );
        debtHistory[_borrower].push(debtNo);
    }

    function updateLender(bytes32 debtNo, address _lender)
        external
        onlyContract(CONTRACT_LOAN_MANAGER)
    {
        debtInfo[debtNo].lender = _lender;
        debtInfo[debtNo].loanState = uint8(LoanState.FUNDED);
        lendHistory[_lender].push(debtNo);
    }

    function completeDebt(bytes32 debtNo)
        external
        onlyContract(CONTRACT_LOAN_MANAGER)
    {
        debtInfo[debtNo].loanState = uint8(LoanState.PAID);
    }

    function setHaveDebt(address _sender,bool _state) external onlyContract(CONTRACT_LOAN_MANAGER){
        haveDebt[_sender] = _state;
    }

    function checkHaveDebt(address _address) external view returns(bool){
        return haveDebt[_address];
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
        return debtHistory[_address];
    }

    function getLendHistory(address _address)
        external
        view
        returns (bytes32[] memory)
    {
        return lendHistory[_address];
    }
}
