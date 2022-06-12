// SPDX-License-Identifier: MIT
pragma solidity =0.8.1;

interface IExchange {
    function exchange(address nft, uint256 tokenId, address from, address to) external;

    function mint(address nft, address to) external;
}
