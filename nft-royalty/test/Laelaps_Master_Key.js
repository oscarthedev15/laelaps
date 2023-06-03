const LaelapsMasterKey = artifacts.require("LaelapsMasterKey");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

contract("LaelapsMasterKey", function (accounts) {
  it("should support the ERC721 and ERC2198 standards", async () => {
    const LaelapsMasterKeyInstance = await LaelapsMasterKey.deployed();
    const ERC721InterfaceId = "0x80ac58cd";
    const ERC2981InterfaceId = "0x2a55205a";
    var isERC721 = await LaelapsMasterKeyInstance.supportsInterface(ERC721InterfaceId);
    var isER2981 = await LaelapsMasterKeyInstance.supportsInterface(
      ERC2981InterfaceId
    );
    assert.equal(isERC721, true, "LaelapsMasterKey is not an ERC721");
    assert.equal(isER2981, true, "LaelapsMasterKey is not an ERC2981");
  });
  it("should return the correct royalty info when specified and burned", async () => {
    const LaelapsMasterKeyInstance = await LaelapsMasterKey.deployed();
    await LaelapsMasterKeyInstance.mintNFT(accounts[0]);
    // Override royalty for this token to be 10% and paid to a different account
  

    const defaultRoyaltyInfo = await LaelapsMasterKeyInstance.royaltyInfo.call(
      1,
      1000
    );
    var tokenRoyaltyInfo = await LaelapsMasterKeyInstance.royaltyInfo.call(2, 1000);
    const owner = await LaelapsMasterKeyInstance.owner.call();
    assert.equal(
      defaultRoyaltyInfo[0],
      owner,
      "Default receiver is not the owner"
    );
    assert.equal(defaultRoyaltyInfo[1].toNumber(), 10, "Royalty fee is not 10");
    assert.equal(
      tokenRoyaltyInfo[0],
      accounts[1],
      "Royalty receiver is not a different account"
    );
    assert.equal(tokenRoyaltyInfo[1].toNumber(), 100, "Royalty fee is not 100");


  });
});