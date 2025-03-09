// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface ITradingExecutor {
    function executeTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        uint8 sentiment
    ) external returns (uint256);

    function authorizedStrategies(address) external view returns (bool);

    function setAuthorization(address _strategy, bool _authorized) external;
} 