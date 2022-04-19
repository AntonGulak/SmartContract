pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./IERC2981.sol";

/**
 * @title Sample NFT contract
 * @dev Extends ERC-721 NFT contract and implements ERC-2981
 */

contract Token is Ownable, ERC721Enumerable, ERC721URIStorage {

    mapping(string => uint8) hashes;
    address public royaltiesReceiver;
    uint256 public royaltiesPercentage;
    uint256 public maxSupply;

    event Mint(uint256 tokenId, address recipient);

    constructor(uint256 royaltiesPercentage, uint256 _royaltiesPercentage, uint256 _maxSupply, string memory _name, string memory _symbol) ERC721(_name, _symbol) {
         royaltiesReceiver = msg.sender;
         maxSupply = _maxSupply;
         royaltiesPercentage = _royaltiesPercentage;
     }

    /** Overrides ERC-721's _baseURI function */
    function _baseURI() internal view override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/";
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
    internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _burn(uint256 tokenId)
    internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /// @notice Changes the royalties' recipient address (in case rights are
    ///         transferred for instance)
    /// @param newRoyaltiesReceiver - address of the new royalties recipient
    function setRoyaltiesReceiver(address newRoyaltiesReceiver)
    external onlyOwner {
        require(newRoyaltiesReceiver != royaltiesReceiver); // dev: Same address
        royaltiesReceiver = newRoyaltiesReceiver;
    }

    /// @notice Returns a token's URI
    /// @dev See {IERC721Metadata-tokenURI}.
    /// @param tokenId - the id of the token whose URI to return
    /// @return a string containing an URI pointing to the token's ressource
    function tokenURI(uint256 tokenId)
    public view override(ERC721, ERC721URIStorage)
    returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public view override(ERC721, ERC721Enumerable)
    returns (bool) {
        return interfaceId == type(IERC2981).interfaceId ||
        super.supportsInterface(interfaceId);
    }


    function tokensOfOwner(address _owner) external view
    returns(uint256[] memory ownerTokens ) {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory result = new uint256[](tokenCount);

        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            for (uint256 i=0; i<tokenCount; i++) {
                result[i] = tokenOfOwnerByIndex(_owner, i);
            }
            return result;
        }
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view
    returns (address receiver, uint256 royaltyAmount) {
        uint256 _royalties = (_salePrice * royaltiesPercentage) / 100;
        return (royaltiesReceiver, _royalties);
    }


    function mint(address recipient, string memory hash)
    external onlyOwner
    returns (uint256 tokenId)
    {
        require(totalSupply() <= maxSupply, "All tokens minted");
        require(bytes(hash).length > 0);
        require(hashes[hash] != 1);
        hashes[hash] = 1;
        uint256 newItemId = totalSupply() + 1;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, hash);
        emit Mint(newItemId, recipient);
        return newItemId;
    }
}