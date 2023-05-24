pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Potato is ERC721 {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _randNonce;

    address private _contractOwner;
    mapping(uint256 => uint) private _explodeTimes;

    constructor() public ERC721("Potato", "P") {
        _contractOwner = msg.sender;
    }

    function givePlayer(address player) public returns(uint256 newId) {
        _tokenIds.increment();

        newId = _tokenIds.current();
        _safeMint(player, newId);

        _explodeTimes[newId] = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _randNonce.current()))) % 24 hours;
        _randNonce.increment();

        return newId;
    }

    function explode(uint256 tokenId) public {
        require(block.timestamp >= _explodeTimes[tokenId], "Not ready to explode yet!");
        // _safeTransfer(ownerOf(tokenId), )
    }

    function hasExploded(uint256 tokenId) public view returns(bool res) {
        res = block.timestamp >= _explodeTimes[tokenId];
    }

}