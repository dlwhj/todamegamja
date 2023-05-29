// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "./Todame.sol";

import "hardhat/console.sol";

contract Potato is ERC721Enumerable {
    
    uint16 public constant MAX_POTATOES = 4;
    uint256 public constant MAX_EXPLODE_TIME = 6 hours;

    mapping(address => uint256) public wins; 


    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    Counters.Counter private _randNonce;

    address private _contractOwner;
    uint16 private _count; // number of living Potato tokens

    Todame private _todame;

    using EnumerableMap for EnumerableMap.UintToUintMap;
    EnumerableMap.UintToUintMap private _explodeTimes;

    constructor() ERC721("Potato", "P") {
        _contractOwner = msg.sender;

        _todame = new Todame(10000);
    }

    function getTodameBalance(address player) public view returns(uint256 balance) {
        balance = _todame.balanceOf(player); 
    }

    // DEBUG
    function getCount() public view returns(uint16 count) {
        count = _count;
    }

    // DEBUG
    function getExplodeTime(uint256 tokenId) public view returns(uint256 explodeTime) {
        explodeTime = _explodeTimes.get(tokenId);
    }

    function hasExploded(uint256 tokenId) public view returns(bool res) {
        res = _explodeTimes.get(tokenId) == 0 || block.timestamp > _explodeTimes.get(tokenId);
    }

    function getWins(address player) public view returns(uint256 num) {
        num = wins[player];
    }

    function play() public returns(uint256 newId) {  
        _explode();
       
        require(_count < MAX_POTATOES, "There are already maximum number of potatoes...");
        
        _tokenId.increment();
        _count += 1;

        newId = _tokenId.current();
        _safeMint(msg.sender, newId);

        _explodeTimes.set(newId, block.timestamp + (uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _randNonce.current()))) % MAX_EXPLODE_TIME));
        _randNonce.increment();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override {
        if (from != address(0) && block.timestamp > _explodeTimes.get(tokenId)) {
            console.log("Explode %s -> %s : %d", from, to, tokenId);
            revert("The token has already exploded!");
        }

        if (from != address(0)) {
            wins[from] += 1;
            _todame.transfer(from, 1);
            console.log("Transfer %s -> %s : %d", from, to, tokenId);
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override {
        
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    function _explode() private {
        uint16 i = 0;
        
        while (i < _explodeTimes.length()) {
            (uint256 tokenId, uint256 explodeTime) = _explodeTimes.at(i);

            if (block.timestamp > explodeTime) {
                _count -= 1;
                _explodeTimes.remove(tokenId);
                console.log("Cleaning up %d, count is: ", tokenId, _count);
            }

            i++;
        }
    }

}