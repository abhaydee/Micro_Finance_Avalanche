pragma solidity ^0.6.0;

import "./ContractManager.sol";
import "./ContractNames.sol";


/**
    @title BaseContainer
    @dev Contains all getters of contract addresses in the system
    @author abhaydeshpande
 */
contract BaseContainer is ContractManager, ContractNames {
    function getAddressOfLoanManager() public view returns (address) {
        return getContract(CONTRACT_LOAN_MANAGER);
    }

    function getAddressOfWallet() public view returns (address) {
        return getContract(CONTRACT_WALLET);
    }

    function getAddressOfLoanDB() public view returns (address) {
        return getContract(CONTRACT_LOAN_DB);
    }

    function getAddressOfHeartToken() public view returns (address) {
        return getContract(CONTRACT_HEART_TOKEN);
    }
}
