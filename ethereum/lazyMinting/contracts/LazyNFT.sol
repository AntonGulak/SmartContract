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

  struct NFTVoucher {
    uint256 tokenId;
    uint256 minPrice;
    uint256 salt;
    address maker;
    string uri;
   }

  uint256 public constant serviceComissionNumerator = 5;
  uint256 public constant serviceComissionDenominator = 100;
  mapping(bytes32 => bool) public activationVouchers;

  constructor(string memory _SIGNING_DOMAIN, 
              string memory _SIGNATURE_VERSION
              )
        ERC721("SOAPBUBBLE_COLLECTION", "SPBBL") 
        EIP712(_SIGNING_DOMAIN, _SIGNATURE_VERSION)
    {
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

  function redeem(address redeemer,
                  NFTVoucher calldata voucher,
                  bytes memory signature) 
        public payable returns (uint256) 
    {
    address signer = _verify(voucher, signature);
    console.log(signer);
    require(voucher.maker == signer, "Signature invalid or unauthorized");
    require(msg.value >= voucher.minPrice, "Insufficient funds to redeem");

 
    _mint(signer, voucher.tokenId);
    _setTokenURI(voucher.tokenId, voucher.uri);
    _transfer(signer, redeemer, voucher.tokenId);
    uint256 amount = voucher.minPrice * 
                     (serviceComissionDenominator - serviceComissionNumerator) / serviceComissionDenominator;
    (bool success,) = (voucher.maker).call{value: amount}("");
    
    require(success, "Failed to send money");
    return voucher.tokenId;
  }


  function _hash(NFTVoucher calldata voucher) internal returns (bytes32) {
    bytes32 voucherHash = _hashTypedDataV4(keccak256(abi.encode(
    keccak256("NFTVoucher(uint256 tokenId,uint256 minPrice,uint256 salt, address maker,string uri)"),
        voucher.tokenId,
        voucher.maker,
        voucher.minPrice,
        keccak256(bytes(voucher.uri))
    )));
    require(activationVouchers[voucherHash] == false, "Voucher already activated");
    activationVouchers[voucherHash] = true;
    return voucherHash;
  }
  
  function _verify(NFTVoucher calldata voucher, bytes memory signature) internal returns (address) {
    bytes32 digest = _hash(voucher);
    return digest.toEthSignedMessageHash().recover(signature);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override (AccessControl, ERC721) returns (bool) {
    return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
  }

  function withdrawByAdmin(address payable _destination) external onlyAdmin {
    (bool success,) = _destination.call{value: address(this).balance}("");
    require(success, "Failed to send money");
  }

  function cancelVoucher(NFTVoucher calldata voucher) external {
    require(voucher.maker == msg.sender, "You are not the owner");
    _hash(voucher);
  }

  modifier onlyAdmin() {
    require(
        hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
        "function only for admin"
    );
    _;
  }
}