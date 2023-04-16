pragma solidity ^0.6.0;

import "../auth/Owned.sol";


/**
    @title ContractManager
    @dev Manages all the contract in the system
    @author abhaydeshpande
 */
contract ContractManager is Owned {
    mapping(string => address) private contracts;

    function addContract(string memory name, address contractAddress)
        public
        onlyOwner
    {
        require(contracts[name] == address(0), "Contract already exists");
        contracts[name] = contractAddress;
    }

    function getContract(string memory name) public view returns (address) {
        require(contracts[name] != address(0), "Contract hasn't set yet");
        return contracts[name];
    }
}
