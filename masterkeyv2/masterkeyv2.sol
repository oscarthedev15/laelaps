// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LaelapsMasterKey is Ownable, ERC721A {

    uint256 public  MAX_SUPPLY = 150;
    uint256 public PRICE_PER_TOKEN = 150000000000000000;
    bool public mintPaused; 
    string private _baseTokenURI;
    address public REWARD_WALLET = 0x7a188ee785589636059738DDA5F26e93062f473f;


    constructor(bool _paused) ERC721A("Laelaps Master Key", "LMK") {
        mintPaused = _paused;
    }

    function mintMultiple(address to, uint256 quantity) external payable onlyOwner{
        require(!mintPaused, "Mint is paused");
        require(_totalMinted() + quantity <= MAX_SUPPLY, "Max Supply Hit");
        _mint(to, quantity);
    }

    function mintSingle(address to) external payable {
        require(!mintPaused, "Mint is paused");
        require(_totalMinted() + 1 <= MAX_SUPPLY, "Max Supply Hit");
        require(msg.value >= PRICE_PER_TOKEN, "Insufficient funds");
        _mint(to, 1);
        uint amountOut = address(this).balance;
        require(amountOut > 0, "No balance to transfer");
        payable(REWARD_WALLET).transfer(amountOut);
    }

    function setMintPrice(uint256 _price) external onlyOwner {
        PRICE_PER_TOKEN = _price;
    }

    function setTotalSupply(uint256 _supply) external onlyOwner {
        MAX_SUPPLY = _supply;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer Failed");
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function pauseMint(bool _paused) external onlyOwner {
        require(!mintPaused, "Contract paused.");
        mintPaused = _paused;
    }

     function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        string memory baseURI = _baseURI();
        return baseURI;
    }


}