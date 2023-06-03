require("dotenv").config();
const mnemonic = process.env["MNEMONIC"];
const infuraApiKey = process.env["INFURA_API_KEY"];

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    goerli: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://goerli.infura.io/v3/${infuraApiKey}`
        ),
      network_id: 5, // Goerli's network id
      chain_id: 5, // Goerli's chain id
      gas: 8000000, // Gas limit used for deploys.
      confirmations: 2, // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets)
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://sepolia.infura.io/v3/${infuraApiKey}`
        ),
      network_id: 11155111, // Goerli's network id
      chain_id: 11155111, // Goerli's chain id
      gas: 5500000, // Gas limit used for deploys.
      confirmations: 2, // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets)
    },
    matic: {
      provider: () =>
        new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.15", // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
};
