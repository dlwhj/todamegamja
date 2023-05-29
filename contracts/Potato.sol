// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "./Todame.sol";

import "hardhat/console.sol";

contract Potato is ERC721Enumerable {
    
    using EnumerableMap for EnumerableMap.UintToUintMap;
    using EnumerableMap for EnumerableMap.UintToAddressMap;

    uint16 public constant MAX_POTATOES = 4;
    uint256 public constant MAX_EXPLODE_TIME = 6 hours;

    mapping(address => uint256) public wins; 



    

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    Counters.Counter private _randNonce;

    address private _contractOwner;
    uint16 private _count; // number of living Potato tokens

    Todame private _todame;

    EnumerableMap.UintToUintMap private _explodeTimes;

    mapping(uint256 => address[]) private _potatoToPlayers;

    constructor() ERC721("Potato", "P") {
        _contractOwner = msg.sender;

        _todame = new Todame(100000);
    }
    
    // DEBUG
    function getExplodeTime(uint256 tokenId) public view returns(uint256 explodeTime) {
        explodeTime = _explodeTimes.get(tokenId);
    }

    function getTodameBalance(address player) public view returns(uint256 balance) {
        balance = _todame.balanceOf(player); 
    }

    function getCount() public view returns(uint16 count) {
        count = _count;
    }

    function hasExploded(uint256 tokenId) public view returns(bool res) {
        res = _explodeTimes.get(tokenId) == 0 || block.timestamp > _explodeTimes.get(tokenId);
    }

    function getWins(address player) public view returns(uint256 num) {
        num = wins[player];
    }

    function play() public returns(uint256 newId) {  
        _gameInit();
       
        require(_count < MAX_POTATOES, "There are already maximum number of potatoes...");
        
        _tokenId.increment();
        _count += 1;

        newId = _tokenId.current();
        _safeMint(msg.sender, newId);

        _explodeTimes.set(newId, block.timestamp + (uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _randNonce.current()))) % MAX_EXPLODE_TIME));
        _randNonce.increment();

        _potatoToPlayers[newId].push(msg.sender);
    }

    function join(uint256 tokenId) public {
        require(_potatoToPlayers[tokenId].length < MAX_POTATOES, "There are too many players here...");

        _potatoToPlayers[tokenId].push(msg.sender);
        console.log("%s joined, %d players joined for %d", msg.sender, _potatoToPlayers[tokenId].length, tokenId);
    }

    function _isPlayerValid(uint256 tokenId, address player) internal view returns(bool) {
        uint256 len = _potatoToPlayers[tokenId].length;

        for (uint256 i = 0; i < len; i++) {
            if (_potatoToPlayers[tokenId][i] == player) {
                return true;
            }
        }

        return false;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override {
        if (from == address(0)) {
            super._beforeTokenTransfer(from, to, tokenId, batchSize);
            return;
        }

        require(_potatoToPlayers[tokenId].length == MAX_POTATOES, "Not ready!");
        require(_isPlayerValid(tokenId, to), "Invalid destination!");
        require(block.timestamp <= _explodeTimes.get(tokenId), "The token has already exploded!");

        wins[from] += 1;
        _todame.transfer(from, 1);
        console.log("Transfer %s -> %s : %d", from, to, tokenId);

        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _gameInit() private {
        uint16 i = 0;
        
        while (i < _explodeTimes.length()) {
            (uint256 tokenId, uint256 explodeTime) = _explodeTimes.at(i);

            if (block.timestamp > explodeTime) {
                _count -= 1;
                _explodeTimes.remove(tokenId);
                delete _potatoToPlayers[tokenId];
                console.log("Cleaning up %d, count is: ", tokenId, _count);
            }

            i++;
        }
    }

}