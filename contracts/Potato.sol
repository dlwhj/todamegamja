// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "./Todame.sol";

import "hardhat/console.sol";

contract Potato is ERC721Enumerable {
    
    uint16 public constant MAX_POTATOES = 12;
    uint256 public constant MAX_EXPLODE_TIME = 6 hours;

    mapping(address => uint256) public wins; 

    using EnumerableMap for EnumerableMap.AddressToUintMap;
    EnumerableMap.AddressToUintMap private winners;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    Counters.Counter private _randNonce;

    address private _contractOwner;
    uint16 private _count; // number of living Potato tokens

    Todame private _todame;

    mapping(uint256 => uint256) private _explodeTimes;

    constructor() ERC721("Potato", "P") {
        _contractOwner = msg.sender;

        _todame = new Todame(10000);
    }

    function getTodameBalance(address player) public view returns(uint256 balance) {
        balance = _todame.balanceOf(player); 
    }

    // DEBUG
    function getExplodeTime(uint256 tokenId) public view returns(uint256 explodeTime) {
        explodeTime = _explodeTimes[tokenId];
    }

    // DEBUG
    function getCount() public view returns(uint16 count) {
        count = _count;
    }

    // DEBUG
    function setExplodeTime(uint256 tokenId, uint256 explodeTime) public {
        _explodeTimes[tokenId] = explodeTime;
    }

    function hasExploded(uint256 tokenId) public view returns(bool res) {
        res = _explodeTimes[tokenId] == 0;
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

        _explodeTimes[newId] = block.timestamp + (uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _randNonce.current()))) % MAX_EXPLODE_TIME);
        _randNonce.increment();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override {
        if (from != address(0) && block.timestamp > _explodeTimes[tokenId]) {
            console.log("Explode %s -> %s : %d", from, to, tokenId);
            _explode(tokenId);
            winners.set(from, 0);
            revert("The token has already exploded!");
        }

        if (from != address(0)) {
            wins[from] += 1;
            (bool found, uint256 w) = winners.tryGet(from);
            if (found) {
                winners.set(from, w + 1);
            }
            else {
                winners.set(from, 1);
            }
            ( found,  w) = winners.tryGet(from);
        }

        console.log("Transfer %s -> %s : %d", from, to, tokenId);
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override {
        
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    function _explode(uint256 tokenId) private {
        _count -= 1;
        delete _explodeTimes[tokenId];
        _endGame();
    }

    function _endGame() private {
        uint256 i = 0;
        while (i < winners.length()) {
            (address player, uint256 w) = winners.at(i);
            if (player != address(0) && w > 0) {
                console.log("Game END: %s has won %d rounds", player, w);
                _todame.transfer(player, 1);
                winners.remove(player);
            }
            i++;
        }
    }

}