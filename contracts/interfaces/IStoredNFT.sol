// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.1;

// solhint-disable no-inline-assembly

interface IStoredNFT{

    function verifyOwner(uint256 tokenId, address who) external view returns(bool);

    function mintToken(address to) external returns(uint256 tokenId);
    
}
