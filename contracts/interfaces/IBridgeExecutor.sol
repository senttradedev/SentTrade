// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IBridgeExecutor {
    function executeStrategy(
        uint256 chainIdTo,
        address receiver,
        bytes memory callData
    ) external payable;
} 