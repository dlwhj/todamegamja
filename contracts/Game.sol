pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Game is ERC721, Potato {

    using Counters for Counters.Counter;

    address private _contractOwner;

    function balanceOf(address _owner) external view returns uint256 {
        return;
    }

    function ownerOf(uint256 _tokenId) external view returns address {
        return;
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerPotatoCount[_to].increment();
        ownerPotatoCount[_from].increment();
        PotatoToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        _transfer(_from, _to, _tokenId);
    }

    function start() internal {
        require(_tokenIds < 12, "There are already maximum number of potatoes...");
        
    }
}