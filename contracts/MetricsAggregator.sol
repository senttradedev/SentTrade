// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract MetricsAggregator {
    struct TokenMetrics {
        uint256 price;
        uint256 volume24h;
        uint256 liquidity;
        uint256 volatility;
        uint256 lastUpdate;
    }

    mapping(address => TokenMetrics) public tokenMetrics;
    
    function updateMetrics(
        address token,
        uint256 price,
        uint256 volume,
        uint256 liquidity,
        uint256 volatility
    ) external {
        tokenMetrics[token] = TokenMetrics({
            price: price,
            volume24h: volume,
            liquidity: liquidity,
            volatility: volatility,
            lastUpdate: block.timestamp
        });
    }

    function getTokenMetrics(address token) 
        external 
        view 
        returns (TokenMetrics memory) 
    {
        return tokenMetrics[token];
    }
} 