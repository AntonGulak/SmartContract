pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TokenERC721 is AccessControl, ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenID; 
    string private _baseMetaURI;

    mapping(uint256 => string) public id_to_meta;
    mapping(string => bool) public meta_to_flag;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol)  {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _baseMetaURI = "https://ipfs.io/ipfs/";
    }

    function mint(address owner, string memory metadata) external onlyAdmin {
        require(meta_to_flag[metadata] == false, "token repetition");

        _safeMint(owner,  _tokenID.current());
        id_to_meta[_tokenID.current()] = metadata;
        meta_to_flag[metadata] = true;
        _tokenID.increment();
    }

    function burn(uint256 tokenId) external onlyAdmin {
        _burn(tokenId);
        meta_to_flag[id_to_meta[tokenId]] = false;
        id_to_meta[tokenId] = "";
    }

    function setBaseURI(string memory baseURI) public onlyAdmin {
        _baseMetaURI = baseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns(string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_baseURI(), id_to_meta[tokenId]));
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseMetaURI;
    }
    
    function supportsInterface(bytes4 interfaceId) public 
             view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "function only for admin"
        );
        _;
    }
}