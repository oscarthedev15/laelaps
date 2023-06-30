// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";

contract LaelapsMasterKey is ERC721URIStorage, ERC2981, Ownable, DefaultOperatorFilterer {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  uint256 public mintCost = 100000;
  string public tokenURI;
  uint256 public locked = 0;
  address private constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
  address public LAELAPS_ADDRESS = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
  address public BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
  address public REWARD_WALLET = 0x897aec1BEb0Ce116B250dEaFeB3860F41EE4a9C9;
  uint256 public TOTAL_SUPPLY = 200;
  uint256 public burnPercentage = 0;
  uint256 public rewardPercentage = 100;

  IUniswapV2Router02 private uniswapRouter;

  
  constructor(string memory _uri) ERC721("Laelaps Master Key", "LMK") {
    _setDefaultRoyalty(msg.sender, 100);
    tokenURI = _uri;
    uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
  }

  function setTokenUri(string memory _uri) public onlyOwner {
    tokenURI = _uri;
  }

  function setBurnPercentage(uint256 _burnPercentage) public onlyOwner {
    burnPercentage = _burnPercentage;
  }

  function setRewardPercentage(uint256 _rewardPercentage) public onlyOwner {
    rewardPercentage = _rewardPercentage;
  }

  function setTotalSupply(uint256 _supply) public onlyOwner {
    TOTAL_SUPPLY = _supply;
  }

  function setMintPrice(uint256 _mintPrice) public onlyOwner {
    mintCost = _mintPrice;
  }

  function setRoyalty(uint96 _royalty) public onlyOwner {
    _setDefaultRoyalty(msg.sender, _royalty);
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
      require(burnPercentage + rewardPercentage <= 100, "percentages set wrong");
      uint256 tokenId = _tokenIds.current();
      require(tokenId < TOTAL_SUPPLY, "no more supply");
      buyAndBurnLaelaps();
      sendToRewardWallet();
      uint256 newItemId = _tokenIds.current();
      _tokenIds.increment();
      _safeMint(recipient, newItemId);
      _setTokenURI(newItemId, tokenURI);
      return newItemId;
  }

  function buyAndBurnLaelaps() internal {
    if (burnPercentage > 0) {
      address[] memory path = new address[](2);
      uint amountOutMin = address(this).balance * burnPercentage / 100;
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

  function sendToRewardWallet() internal {
    if(rewardPercentage > 0) {
      uint amountOut = address(this).balance * rewardPercentage / 100;
      require(amountOut > 0, "No balance to transfer");
      payable(REWARD_WALLET).transfer(amountOut);
    }
  }

  /// OPERATOR FILTER OVERRIDES
  function setApprovalForAll(address operator, bool approved) public override(ERC721, IERC721) onlyAllowedOperatorApproval(operator) {
    super.setApprovalForAll(operator, approved);
}

function approve(address operator, uint256 tokenId) public override(ERC721, IERC721) onlyAllowedOperatorApproval(operator) {
    super.approve(operator, tokenId);
}

function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) onlyAllowedOperator(from) {
    super.transferFrom(from, to, tokenId);
}

function safeTransferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) onlyAllowedOperator(from) {
    super.safeTransferFrom(from, to, tokenId);
}

function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
    public
    override(ERC721, IERC721)
    onlyAllowedOperator(from)
{
    super.safeTransferFrom(from, to, tokenId, data);
}
  

}


