pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Todame is ERC20 {

    constructor(uint256 initialSupply) public ERC20("Todame", "TDM") {
        _mint(msg.sender, initialSupply);
    }

}