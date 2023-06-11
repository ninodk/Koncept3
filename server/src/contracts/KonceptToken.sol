// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title A Smart Contract for providing and managing Koncept Tokens (KON)
 * @author Nino De Kerpel
 * @notice This contract mints Koncept Tokens
 */
contract KonceptToken is Context, Ownable, ERC20 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint256) public balances;

    constructor() Ownable() ERC20("Koncept Token", "KON"){
        _mint(msg.sender, 1000000 * (10**decimals()));
    }

    function mintTokens(address to, uint256 amount) external onlyOwner {
        balances[to] += amount;
    }

    /**
     * @dev Transfer tokens to the given address
     * @param to The address of the recipient 
     * @param amount Amount of Koncept Tokens (KON)
     */
    function transferTokens(address to, uint256 amount) external onlyOwner {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}
