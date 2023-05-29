// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Potato is ERC721 {
    
    uint16 public constant MAX_POTATOES = 12;

    mapping(address => uint256) public wins; 

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    Counters.Counter private _randNonce;

    address private _contractOwner;
    uint16 private _count; // number of living Potato tokens


    mapping(uint256 => uint256) private _explodeTimes;

    constructor() ERC721("Potato", "P") {
        _contractOwner = msg.sender;
    }

    function hasExploded(uint256 tokenId) public view returns(bool res) {
        res = block.timestamp >= _explodeTimes[tokenId];
    }

    function getWins(address player) public view returns(uint256 num) {
        num = wins[player];
    }

    function play() public returns(uint256 newId) {
        require(_count < MAX_POTATOES, "There are already maximum number of potatoes...");

        _tokenId.increment();
        _count += 1;

        newId = _tokenId.current();
        _safeMint(msg.sender, newId);

        _explodeTimes[newId] = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _randNonce.current()))) % 24 hours;
        _randNonce.increment();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override {
        if (_explodeTimes[tokenId] > block.timestamp) {
            explode(tokenId);
            revert( "The token has already exploded!");
        }

        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override {
        wins[from] += 1;
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    function explode(uint256 tokenId) public {
        _burn(tokenId);
        _count -= 1;
    }

}