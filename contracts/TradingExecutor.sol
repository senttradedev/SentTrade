// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./interfaces/ITradingExecutor.sol";

interface ISonicRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity);
}

contract TradingExecutor is ITradingExecutor {
    ISonicRouter public sonicRouter;
    mapping(address => bool) public authorizedStrategies;
    
    event TradeExecuted(
        address indexed token,
        uint256 amount,
        bool isBuy,
        uint256 price
    );

    event LiquidityAdded(
        address indexed tokenA,
        address indexed tokenB,
        uint256 amountA,
        uint256 amountB
    );

    event AuthorizationSet(address indexed strategy, bool authorized);

    constructor(address _sonicRouter) {
        sonicRouter = ISonicRouter(_sonicRouter);
    }

    function setAuthorization(address _strategy, bool _authorized) external {
        authorizedStrategies[_strategy] = _authorized;
        emit AuthorizationSet(_strategy, _authorized);
    }

    function executeTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        uint8 sentiment
    ) external returns (uint256) {
        require(authorizedStrategies[msg.sender], "Unauthorized");
        require(sentiment > 0 && sentiment <= 100, "Invalid sentiment");

        // Create path for swap
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        // Execute trade based on sentiment
        uint256[] memory amounts = sonicRouter.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            path,
            msg.sender,
            block.timestamp + 300 // 5 minute deadline
        );

        emit TradeExecuted(
            tokenOut,
            amounts[1],
            true,
            (amounts[0] * 1e18) / amounts[1] // price in terms of input token
        );

        return amounts[1];
    }

    function addLiquidityToPool(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        uint256 minAmountA,
        uint256 minAmountB
    ) external returns (uint256, uint256, uint256) {
        require(authorizedStrategies[msg.sender], "Unauthorized");

        (uint256 amountAAdded, uint256 amountBAdded, uint256 liquidity) = 
            sonicRouter.addLiquidity(
                tokenA,
                tokenB,
                amountA,
                amountB,
                minAmountA,
                minAmountB,
                msg.sender,
                block.timestamp + 300
            );

        emit LiquidityAdded(tokenA, tokenB, amountAAdded, amountBAdded);

        return (amountAAdded, amountBAdded, liquidity);
    }
} 