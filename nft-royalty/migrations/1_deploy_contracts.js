const LaelapsMasterKey = artifacts.require("LaelapsMasterKey");

module.exports = function (deployer) {
  deployer.deploy(
    LaelapsMasterKey,
    "ipfs://Qmap5CZKghakw86yy1yrUrBu55vrTZB7cFS6gFGMyCybRk"
  );
};
