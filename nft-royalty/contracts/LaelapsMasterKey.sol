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
  uint256 public mintCost = 100000;
  string public tokenURI;
  uint256 public locked = 0;
  address private constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
  address public LAELAPS_ADDRESS = 0x6C059413686565D5aD6cce6EED7742c42DbC44CA;
  address public BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
  uint256 public percentage = 100;

  IUniswapV2Router02 private uniswapRouter;

  
  constructor(string memory _uri) ERC721("Laelaps Master Key", "LMK") {
    _setDefaultRoyalty(msg.sender, 100);
    tokenURI = _uri;
    uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
  }

  function setTokenUri(string memory _uri) public onlyOwner {
    tokenURI = _uri;
  }

  function setMintPrice(uint256 _mintPrice) public onlyOwner {
    mintCost = _mintPrice;
  }

  function setRoyalty(uint96 _royalty) public onlyOwner {
    _setDefaultRoyalty(msg.sender, _royalty);
  }

  function getContractBalance() public view onlyOwner returns (uint256) {
    return address(this).balance;
  }

  function getLaelapsBalance() public view onlyOwner returns (uint256) {
    IERC20 laelaps_token = IERC20(LAELAPS_ADDRESS);
    return laelaps_token.balanceOf(address(this));
  }

  function supportsInterface(bytes4 interfaceId)
    public view virtual override(ERC2981, ERC721URIStorage)
    returns (bool) {
      return super.supportsInterface(interfaceId);
  }

  function _burn(uint256 tokenId) internal virtual override onlyOwner{
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

  function changeLaelapsAddress(address _addr) public onlyOwner {
    LAELAPS_ADDRESS = _addr;
  }

  function transferBalanceToOwner() public onlyOwner {
     uint256 balance = address(this).balance;
     require(balance > 0, "Contract balance is zero");
     payable(owner()).transfer(balance);
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
    uint amountOutMin = address(this).balance * percentage / 100;
    require(amountOutMin > 0, "you have no eth yet");
    address WETH_ADDRESS = uniswapRouter.WETH();
    path[0] = WETH_ADDRESS;
    path[1] = LAELAPS_ADDRESS;
    require(amountOutMin > 0, "you have no eth yet");
    address to = address(this);
    uint deadline = block.timestamp + 100;
    uniswapRouter.swapExactETHForTokens{ value: amountOutMin }(amountOutMin, path, to, deadline);
    IERC20 laelaps_token = IERC20(LAELAPS_ADDRESS);
    require(laelaps_token.balanceOf(address(this)) >= 0, "Insufficient funds");
    laelaps_token.transfer(BURN_ADDRESS, laelaps_token.balanceOf(address(this)));


  }
  

}


