pragma solidity ^0.6.0;
import "../lib/ERC20.sol";
import "../container/Contained.sol";

contract HeartToken is ERC20, Contained {
    fallback() external {
        revert();
    }

    receive() external payable {
        revert();
    }

    string private _name;
    uint8 private _decimals;
    string private _symbol;
    string public version = "H1.0";

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
        _mint(buyer, value);
    }

    function removeToken(address remover, uint256 value)
        external
        onlyContained()
    {
        require(balanceOf(remover) >= value, "not enough token to burn");
        _burn(remover, value);
    }
}
