// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "./Todame.sol";

import "hardhat/console.sol";

contract Potato is ERC721Enumerable, Ownable {
    
    using Counters for Counters.Counter;
    using EnumerableMap for EnumerableMap.UintToUintMap;

    uint8 public constant MAX_POTATOES = 11;
    uint256 public constant MAX_EXPLODE_TIME = 6 hours;

    uint8 public potatoCount; // number of living Potato tokens
    mapping(address => uint256) public wins; 

    address private _contractOwner;
    Todame private _todame;

    Counters.Counter private _potatoId;
    Counters.Counter private _randNonce;
    EnumerableMap.UintToUintMap private _explodeTimes;
    mapping(uint256 => address[]) private _potatoToPlayers;

    event openedGame(address player, uint256 potatoId);
    event joinedGame(address player, uint256 potatoId);

    constructor() ERC721("Potato", "P") {
        _contractOwner = msg.sender;
        _todame = new Todame(100000);
    }
    
    function getTDMBalance(address player) external view returns(uint256 balance) {
        balance = _todame.balanceOf(player); 
    }

    function isAlive(uint256 potatoId) external view returns(bool res) {
        res = !(_explodeTimes.get(potatoId) == 0 || block.timestamp > _explodeTimes.get(potatoId));
    }

    function getExplodeTime(uint256 potatoId) external view onlyOwner returns(uint256 explodeTime) {
        explodeTime = _explodeTimes.get(potatoId);
    }

    function openGame() public returns(uint256 newId) {  
        _gameInit();
       
        require(potatoCount < MAX_POTATOES, "There are already maximum number of potatoes...");
        
        _potatoId.increment();
        potatoCount += 1;

        newId = _potatoId.current();
        _safeMint(msg.sender, newId);

        _explodeTimes.set(newId, block.timestamp + (uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _randNonce.current()))) % MAX_EXPLODE_TIME));
        _randNonce.increment();

        _potatoToPlayers[newId].push(msg.sender);

        emit openedGame(msg.sender, newId);
    }

    function joinGame(uint256 potatoId) public {
        require(_potatoToPlayers[potatoId].length < MAX_POTATOES, "There are too many players here...");

        _potatoToPlayers[potatoId].push(msg.sender);

        emit joinedGame(msg.sender, potatoId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 potatoId, uint256 batchSize) internal virtual override {
        if (from == address(0)) {
            super._beforeTokenTransfer(from, to, potatoId, batchSize);
            return;
        }

        require(_potatoToPlayers[potatoId].length == MAX_POTATOES, "Not ready!");
        require(_isPlayerJoined(potatoId, to), "Invalid destination!");
        require(block.timestamp <= _explodeTimes.get(potatoId), "The token has already exploded!");

        wins[from] += 1;
        _todame.transfer(from, 1);
        console.log("Transfer %s -> %s : %d", from, to, potatoId);

        super._beforeTokenTransfer(from, to, potatoId, batchSize);
    }

    function _gameInit() private {
        uint256 len = _explodeTimes.length();

        for (uint16 i = 0; i < len; i++) {
            (uint256 potatoId, uint256 explodeTime) = _explodeTimes.at(i);

            if (block.timestamp > explodeTime) {
                potatoCount -= 1;
                _explodeTimes.remove(potatoId);
                delete _potatoToPlayers[potatoId];
                console.log("Cleaning up %d, count is: ", potatoId, potatoCount);
            }
        }
    }

    function _isPlayerJoined(uint256 potatoId, address player) private view returns(bool) {
        uint256 len = _potatoToPlayers[potatoId].length;

        for (uint8 i = 0; i < len; i++) {
            if (_potatoToPlayers[potatoId][i] == player) {
                return true;
            }
        }

        return false;
    }

}