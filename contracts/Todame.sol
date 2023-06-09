// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Todame is ERC20 {

    address private _contractOwner;

    constructor(uint256 initialSupply) ERC20("Todame", "TDM") {
        _contractOwner = msg.sender;
        _mint(_contractOwner, initialSupply);
    }

}