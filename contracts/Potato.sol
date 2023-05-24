pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Potato is ERC721 {

    constructor() public ERC721("Potato", "P") {
        
    }

}