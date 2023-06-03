// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";


contract LaelapsMasterKey is ERC721URIStorage, ERC2981, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  uint256 private mintCost = 100000;
  string public tokenURI;
  uint256 public locked = 0;
  address private constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
  // address public LAELAPS_ADDRESS = 0x811a10657440928c9cda3580eb54f271ac4b9a19;
  address public LINK = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
  IUniswapV2Router02 private uniswapRouter;

  
  constructor(string memory _uri) ERC721("LaelapsMasterKey V1", "LMK") {
    _setDefaultRoyalty(msg.sender, 100);
    tokenURI = _uri;
    uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
  }

  function setMintPrice(uint256 _mintPrice) public onlyOwner {
    mintCost = _mintPrice;
  }

  function setRoyalty(uint96 _royalty) public onlyOwner {
    _setDefaultRoyalty(msg.sender, _royalty);
  }

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function supportsInterface(bytes4 interfaceId)
    public view virtual override(ERC2981, ERC721URIStorage)
    returns (bool) {
      return super.supportsInterface(interfaceId);
  }

  function _burn(uint256 tokenId) internal virtual override {
    super._burn(tokenId);
    _resetTokenRoyalty(tokenId);
  }

  function burnNFT(uint256 tokenId)
    public onlyOwner {
      _burn(tokenId);
  }

  function lock(uint256 _lock) public onlyOwner {
    if (_lock == 0 || _lock == 1){
      locked = _lock;
    }
  }

  function mintNFT(address recipient)
    public payable 
    returns (uint256) {
      require(msg.value >= mintCost, "Insufficient funds");
      require(bytes(tokenURI).length > 0, "Token URI not set yet");
      require(locked != 1, "Contract Locked");
      buyAndBurnLaelaps();
      uint256 newItemId = _tokenIds.current();
      _tokenIds.increment();
      _safeMint(recipient, newItemId);
      _setTokenURI(newItemId, tokenURI);
      return newItemId;
  }

  function buyAndBurnLaelaps() internal {
    address[] memory path = new address[](2);
    address WETH_ADDRESS = uniswapRouter.WETH();
    path[0] = WETH_ADDRESS;
    path[1] = LINK;
    uint amountOutMin = address(this).balance;
    address to = address(this);
    uint deadline = block.timestamp + 100;

    uniswapRouter.swapExactETHForTokens(amountOutMin, path, to, deadline);

  }
  

}


