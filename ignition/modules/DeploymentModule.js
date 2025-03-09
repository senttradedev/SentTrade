const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeploymentModule", (m) => {
  // First deploy MetricsAggregator as it has no dependencies
  const metricsAggregator = m.contract("MetricsAggregator");

  // Deploy BridgeExecutor with deBridge address parameter
  const bridgeExecutor = m.contract("BridgeExecutor", [
    m.getParameter(
      "deBridgeGateAddress",
      "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA"
    ),
  ]);

  // Deploy TradingExecutor with Sonic Router address
  const tradingExecutor = m.contract("TradingExecutor", [
    m.getParameter(
      "sonicRouterAddress",
      "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
    ),
  ]);

  // Deploy StrategyManager after TradingExecutor and BridgeExecutor
  const strategyManager = m.contract(
    "StrategyManager",
    [tradingExecutor, bridgeExecutor],
    {
      after: [tradingExecutor, bridgeExecutor],
    }
  );

  // Set up authorization for StrategyManager in TradingExecutor
  const setAuthorization = m.call(
    tradingExecutor,
    "setAuthorization",
    [strategyManager, true],
    {
      after: [strategyManager],
    }
  );

  return {
    metricsAggregator,
    bridgeExecutor,
    tradingExecutor,
    strategyManager,
    setAuthorization,
  };
});
