// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


import "@openzeppelin/contracts/utils/Counters.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MasterKey is ERC721, Ownable, ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //Need to set all of these addresses based on the chain
    address private constant UNISWAP_ROUTER_ADDRESS = <UniswapRouterAddress>;
    address private constant LAELAPS_ADDRESS = <LAELAPSAddress>;
    address private constant WETH_ADDRESS = <WETHAddress>
    address private constant BURN_ADDRESS = <BURNAddress>;

    IUniswapV2Router02 private uniswapRouter;
    IUniswapV2Factory private uniswapFactory;

    //Mint cost of .25 WETH in wei
    uint256 private mintCost = 250000000000000000;

    function setLaelapsAddress(address _laelaps) public onlyOwner {
        LAELAPS_ADDRESS = _laelaps;
    }

    function setWETHAddress(address _weth) public onlyOwner {
        WETH_ADDRESS  = _weth;
    }

    function setSwapRouter(address _router) public onlyOwner {
        uniswapRouter = IUniswapV2Router02(_router);
    }

    constructor() ERC721("MasterKey", "LAELAPS") {
        uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
        uniswapFactory = IUniswapV2Factory(uniswapRouter.factory());
    }
    
    function setMintCost(uint256 cost) external onlyOwner {
        mintCost = cost;
    }

    function mintNFT(
        address recipient,
        string memory tokenURI
    ) external payable returns (uint256) {
        //Need to add gas fees in here
        require(msg.value >= mintCost, "Insufficient funds");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, _generateTokenURI(newItemId));

        //To-Do do we need to subtracct gas fees from the 0.25 eth and only convert+burn that?
        laelaps_amt = convertEthToLaelaps()
        sendLaelapsToBurnWallet()

        return newItemId;
    }

    function _generateTokenURI(uint256 tokenId) private pure returns (string memory) {
        // Implement your token URI generation logic here
        // This function should return the metadata URI of the token
    }

    function sendLaelapsToBurnWallet(uint256 amount) internal{
        IERC20 laelaps_token = IERC20(TOKEN_ADDRESS);
        require(laelaps_token.balanceOf(address(this)) >= amoun, "Insufficient funds");
        token.transfer(BURN_ADDRESS, amount);
    }

    //Returns the number of Laelaps Received
    function convertEthToLaelaps() internal returns uint256 {
        IERC20(LAELAPS_ADDRESS).approve(UNISWAP_ROUTER_ADDRESS, amountIn);

        // Specify the desired path from WETH to the output token
        address[] memory path = new address[](2);
        path[0] = WETH_ADDRESS;
        path[1] = LAELAPS_ADDRESS;

        // Swap ETH for the desired token
        uniswapRouter.swapExactETHForTokens{ value: amountIn }(0, path, address(this), block.timestamp);
        return amounts[1]
    }
}
