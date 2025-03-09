// Network-specific addresses
const ADDRESSES = {
  // Sonic Chain
  sonic: {
    deBridgeGate: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
    sonicRouter: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  },
  // Add other networks as needed
};

module.exports = {
  getAddresses: (network) => ADDRESSES[network] || ADDRESSES.sonic,
};
