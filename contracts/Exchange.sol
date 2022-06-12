// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.1;

// solhint-disable no-inline-assembly

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./interfaces/IExchange.sol";
import "./interfaces/IStoredNFT.sol";


contract Exchange is IExchange, Ownable{

    event NFTTransfered(
        address indexed nft,
        address indexed from,
        address indexed to,
        uint256 tokenId
    );

    event NFTMinted(
        address indexed nft,
        address indexed to,
        uint256 tokenId
    );


	constructor() public {
    }

    function exchange(address nft, uint256 tokenId, address from, address to) public override virtual{
        IERC721 n = IERC721(nft);
        n.safeTransferFrom(from, to, tokenId);

        emit NFTTransfered(nft, from, to, tokenId);
    }

    function mint(address nft, address to) public onlyOwner override virtual{
        IStoredNFT n = IStoredNFT(nft);
        uint256 tokenId = n.mintToken(to);

        emit NFTMinted(nft, to, tokenId);
    }

}