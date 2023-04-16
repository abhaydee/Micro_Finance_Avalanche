pragma solidity ^0.6.0;

import "./container/BaseContainer.sol";
import "./modules/LoanManager.sol";
import "./database/HeartToken.sol";
import "./modules/Wallet.sol";

/**
    @title Proxy
    @dev All public calls that changes the state of blockchain should come through here
    @author abhaydeshpande
 */

contract Proxy is BaseContainer {
    function postRequest(uint256 _amount) external {
        bytes32 _debtNo = (sha256(abi.encodePacked(msg.sender, now)));
        LoanManager(getAddressOfLoanManager()).requestLoan(
            _debtNo,
            msg.sender,
            _amount
        );
    }

    function lendLoan(bytes32 _debtNo) external payable{
        LoanManager(getAddressOfLoanManager()).lendLoan.value(msg.value)(
            _debtNo,
            msg.sender
        );
    }

    function payLoan(bytes32 _debtNo) external payable{
        LoanManager(getAddressOfLoanManager()).payLoan.value(msg.value)(
            _debtNo,
            msg.sender
        );
    }

    function burnToken(uint256 _amount) external {
        HeartToken(payable(getAddressOfHeartToken())).removeToken(msg.sender, _amount);
    }

    function withDraw(uint256 _amount) external {
        Wallet(getAddressOfWallet()).withdraw(msg.sender,_amount);
    }
}
