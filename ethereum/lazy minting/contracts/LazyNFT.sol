//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract LazyNFT is ERC721URIStorage, EIP712, AccessControl {
  using ECDSA for bytes32;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  constructor(string memory _SIGNING_DOMAIN, 
              string memory _SIGNATURE_VERSION)
        ERC721("SOAPBUBBLE_COLLECTION", "SPBBL") 
        EIP712(_SIGNING_DOMAIN, _SIGNATURE_VERSION)
    {
      _setupRole(MINTER_ROLE, msg.sender);
    }

  struct NFTVoucher {
    uint256 tokenId;
    uint256 minPrice;
    string uri;
   }

  function redeem( address redeemer,
                   NFTVoucher calldata voucher,
                   bytes memory signature) 
        public payable returns (uint256) 
    {
    console.log(voucher.tokenId);
    console.log(voucher.minPrice);
    console.log(voucher.uri);

    address signer = _verify(voucher, signature);
    console.log(signer);
    console.logBytes(signature);
    
    require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized");
    require(msg.value >= voucher.minPrice, "Insufficient funds to redeem");

 
    _mint(signer, voucher.tokenId);
    _setTokenURI(voucher.tokenId, voucher.uri);
    _transfer(signer, redeemer, voucher.tokenId);

    // record payment to signer's withdrawal balance
    //pendingWithdrawals[signer] += msg.value;

    return voucher.tokenId;
  }


  function _hash(NFTVoucher calldata voucher) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(
      keccak256("NFTVoucher(uint256 tokenId,uint256 minPrice,string uri)"),
        voucher.tokenId,
        voucher.minPrice,
        keccak256(bytes(voucher.uri))
    )));
  }
  
  function _verify(NFTVoucher calldata voucher, bytes memory signature) internal view returns (address) {
    bytes32 digest = _hash(voucher);
    return digest.toEthSignedMessageHash().recover(signature);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override (AccessControl, ERC721) returns (bool) {
    return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
  }
}