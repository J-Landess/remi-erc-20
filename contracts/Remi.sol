// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Remi
/// @notice ERC20 token with fixed supply minted to deployer; owner may burn own tokens or force-burn any holder.
contract Remi is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("Remi", "REMI")
        Ownable(initialOwner)
    {
        _mint(initialOwner, 100_000_000 * 10 ** decimals());
    }

    /// @notice Owner burns their own tokens.
    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
    }

    /// @notice Owner burns tokens held by any address.
    function forceBurn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}
