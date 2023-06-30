const LaelapsMasterKey = artifacts.require("LaelapsMasterKey");

module.exports = function (deployer) {
  deployer.deploy(
    LaelapsMasterKey,
    "ipfs://QmQgzCCDL4cVAYjRK5huQh3LbPtNf1cy39HscDzL5fif8h"
  );
};
