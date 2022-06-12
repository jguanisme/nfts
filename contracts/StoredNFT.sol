// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.1;

// solhint-disable no-inline-assembly

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC721PresetMinterPauserAutoId.sol";
import "./interfaces/IStoredNFT.sol";

contract StoredNFT is IStoredNFT, ERC721PresetMinterPauserAutoId, Ownable {
    using Counters for Counters.Counter;

    constructor(string memory name_, string memory symbol_,
        string memory baseTokenURI_
        ) public ERC721PresetMinterPauserAutoId(name_, symbol_, baseTokenURI_){
    }

    function verifyOwner(uint256 tokenId, address who) public override view virtual returns(bool) {
        return ownerOf(tokenId)==who;
    }


    function mintToken(address to) public override virtual returns(uint256 tokenId){
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have minter role to mint");

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        tokenId = _tokenIdTracker.current();
        _mint(to, tokenId);
        _tokenIdTracker.increment();
    }

}