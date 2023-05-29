pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Game is ERC721, Potato {

    Counters.Counter private _gameIds;

    function start(address from, address to, uint256 potatoId) internal returns(uint256 newGameId) {
        require(_tokenIds < 12, "There are already maximum number of potatoes...");
        safeTransferFrom(from, to, potatoId);
        _gameIds.increment();
        newGameId = _gameIds.current();
        return newId;
    }

    function gameEnded(uint256 potatoId) internal returns(bool) {
        if (ownerOf(potatoId) == _contractOwner) {
            _gameIds.decrement();
            return true;
        }
        else {
            return false;
        }
    }


}