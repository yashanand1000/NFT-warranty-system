// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract pydo is ERC721, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  mapping(string => uint8) existingURIs;

  constructor() ERC721('PyDO', 'PDO') {}

  function _baseURI() internal pure override returns (string memory) {
    return 'ipfs://';
  }

  function safeMint(address to, string memory uri) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    existingURIs[uri] = 1;
  }

  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function isContentOwned(string memory uri) public view returns (bool) {
    return existingURIs[uri] == 1;
  }

  function approveTransfer(address to, uint256 tokenId) public {
    approve(to, tokenId);
  }

  function payToMint(address recipient, string memory metadataURI)
    public
    returns (uint256)
  {
    require(existingURIs[metadataURI] != 1, 'NFT already minted!');

    uint256 newItemId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    existingURIs[metadataURI] = 1;
    _mint(recipient, newItemId);
    _setTokenURI(newItemId, metadataURI);

    return newItemId;
  }

  function transferNFT(
    address from,
    address to,
    uint256 transferTokenId
  ) public {
    safeTransferFrom(from, to, transferTokenId);
  }

  function count() public view returns (uint256) {
    return _tokenIdCounter.current();
  }
}
