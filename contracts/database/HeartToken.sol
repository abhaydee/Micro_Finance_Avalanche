// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lib/ERC20.sol";
import "../container/Contained.sol";

/**
    @title HeartToken
    @dev defines an ERC20 token to mint tokens and burn tokens
    @author abhaydeshpande
 */

contract HeartToken is ERC20, Contained {
    string private _name;
    uint8 private _decimals;
    string private _symbol;

    constructor() public {
        _name = "Heart Token"; // Set the name for display purposes
        _decimals = 0; // Amount of decimals for display purposes
        _symbol = "HEART"; // Set the symbol for display purposes
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function getToken(address buyer, uint256 value)
        external
        onlyContract(CONTRACT_LOAN_MANAGER)
    {
        require(buyer != address(0), "Invalid address");
        require(value > 0, "Invalid value");
        _mint(buyer, value);
    }

    function removeToken(address remover, uint256 value)
        external
        onlyContained()
    {
        require(remover != address(0), "Invalid address");
        require(value > 0, "Invalid value");
        require(balanceOf(remover) >= value, "Not enough token to burn");
        _burn(remover, value);
    }
}
