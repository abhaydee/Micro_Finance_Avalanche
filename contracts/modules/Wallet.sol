pragma solidity ^0.6.0;
import "../lib/SafeMath.sol";
import "../container/Contained.sol";


/**
    @title Wallet
    @dev All of amount of money for funds and pay back is stored here.
    @author abhaydeshpande
 */

contract Wallet is Contained {
    using SafeMath for uint256;
    event Deposited(address indexed payee, uint256 weiAmount);
    event Withdrawn(address indexed payee, uint256 weiAmount);
    mapping(address => uint256) private _deposits;

    function depositsOf(address payee) public view returns (uint256) {
        return _deposits[payee];
    }

    /**
     * @dev Stores the sent amount as credit to be withdrawn.
     * @param payee The destination address of the funds.
     */
    function deposit(address payee)
        public
        payable
        onlyContract(CONTRACT_LOAN_MANAGER)
    {
        uint256 amount = msg.value;
        _deposits[payee] = _deposits[payee].add(amount);

        emit Deposited(payee, amount);
    }

    /**
     * @dev Withdraw accumulated balance for a payee.
     * @param payee The address whose funds will be withdrawn and transferred to.
     */
    function withdraw(address payable payee, uint256 payment)
        public
        onlyContained
    {
        _deposits[payee] = _deposits[payee].sub(payment);

        payee.transfer(payment);

        emit Withdrawn(payee, payment);
    }
}
