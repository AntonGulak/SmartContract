pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Character is AccessControl, ERC721 {

    uint private _tokedId;
    string private _baseMetaURI;


    mapping(uint256 => string) public id_to_meta;
    mapping(string => bool) public meta_to_id;

    constructor() ERC721("Character", "CHARACTER")  {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _tokedId = 0;
        _baseMetaURI = "https://ipfs.io/ipfs/";
        mint("QmYsVCpU3b4bByKVfV5Xg6nkDZLWNB7drYnXJBTP2JSWdz");
    }

    function mint(string memory metadata) public onlyAdmin {
        require(meta_to_id[metadata] == false, "token repetition");

        _safeMint(msg.sender, _tokedId);
        id_to_meta[_tokedId] = metadata;
        meta_to_id[metadata] = true;
        _tokedId += 1;
    }

    function burn(uint256 tokenId) external onlyAdmin {
        _burn(tokenId);
        meta_to_id[id_to_meta[tokenId]] = false;
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