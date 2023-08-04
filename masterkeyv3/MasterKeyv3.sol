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
  uint256 public mintCost = 1000000;
  string public tokenURI = "ipfs://QmQgzCCDL4cVAYjRK5huQh3LbPtNf1cy39HscDzL5fif8h";
  uint256 public locked = 0;
  address private constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
  address public LAELAPS_ADDRESS = 0x6C059413686565D5aD6cce6EED7742c42DbC44CA; 
  address public REWARD_WALLET = 0x7a188ee785589636059738DDA5F26e93062f473f;
  uint256 public percentage = 25;
  uint256 public minted = 0;
  uint256 public  MAX_SUPPLY = 100;

  IUniswapV2Router02 private uniswapRouter;
  
  constructor() ERC721("Laelaps Master Key", "LMK") {
    _setDefaultRoyalty(msg.sender, 100);
    uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
  }

  function setTokenUri(string memory _uri) public onlyOwner {
    tokenURI = _uri;
  }

  function setTotalSupply(uint256 _max_supply) public onlyOwner {
    MAX_SUPPLY = _max_supply;
  }

  function setPercentage(uint256 _percentage) public onlyOwner {
      percentage = _percentage;
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

  function transferBalanceToReward() public onlyOwner {
     uint256 balance = address(this).balance;
     require(balance > 0, "Contract balance is zero");
     payable(REWARD_WALLET).transfer(balance);
  }

  function mintNFT(address recipient)
    public payable 
    returns (uint256) {
      require(msg.value >= mintCost, "Insufficient funds");
      require(bytes(tokenURI).length > 0, "Token URI not set yet");
      require(locked != 1, "Contract Locked");
      require(minted + 1 <= MAX_SUPPLY, "Max Supply Hit");

      buyAndBurnLaelaps();
      uint256 newItemId = _tokenIds.current();
      _tokenIds.increment();
      _safeMint(recipient, newItemId);
      _setTokenURI(newItemId, tokenURI);
      minted += 1;
      return newItemId;
  }

  function buyAndBurnLaelaps() internal {
    address[] memory path = new address[](2);
    uint amountOutMin = mintCost * percentage / 100;
    if (amountOutMin > 0) {
      address WETH_ADDRESS = uniswapRouter.WETH();
      path[0] = WETH_ADDRESS;
      path[1] = LAELAPS_ADDRESS;
      address to = address(this);
      uint deadline = block.timestamp + 100;
      uniswapRouter.swapExactETHForTokens{ value: amountOutMin }(amountOutMin, path, to, deadline);
      IERC20 laelaps_token = IERC20(LAELAPS_ADDRESS);
      require(laelaps_token.balanceOf(address(this)) >= 0, "Insufficient funds");
      laelaps_token.transfer(REWARD_WALLET, laelaps_token.balanceOf(address(this)));
    }
  }  


     // OPERATOR FILTER OVERRIDES
    function setApprovalForAll(address operator, bool approved)
        public
        override(ERC721, IERC721)
        onlyAllowedOperatorApproval(operator)
    {
        super.setApprovalForAll(operator, approved);
    }

    function approve(address operator, uint256 tokenId)
        public
        override(ERC721, IERC721)
        onlyAllowedOperatorApproval(operator)
    {
        super.approve(operator, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

}


0x84ECe93731FDf102157A1B570A7a5299C46790bD