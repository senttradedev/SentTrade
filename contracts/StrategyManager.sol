// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./interfaces/ITradingExecutor.sol";
import "./interfaces/IBridgeExecutor.sol";

contract StrategyManager {
    // Signal struct for strategy signals
    struct Signal {
        string tokenSymbol;
        uint8 sentiment; // 0-100
        uint8 strength; // 1-5
        uint256 timestamp;
        bool isActive;
    }

    // Strategy struct to store strategy details
    struct Strategy {
        string name;
        string description;
        uint8 riskLevel; // 1-5, where 5 is highest risk
        bool isActive;
        uint256 performance; // Basis points (e.g. 1000 = 10%)
        address creator;
        uint256 createdAt;
        uint256 lastUpdated;
        uint256 signalCount;
    }

    // Mapping for signals
    mapping(uint256 => mapping(uint256 => Signal)) public strategySignals;

    // Mapping from strategy ID to Strategy
    mapping(uint256 => Strategy) public strategies;
    uint256 public strategyCount;
    
    // Mapping to track which strategy IDs exist
    mapping(uint256 => bool) public strategyExists;
    
    // Array to store all strategy IDs
    uint256[] public allStrategyIds;

    // User settings
    struct UserSettings {
        uint8 maxRiskLevel;
        bool emailNotifications;
        bool pushNotifications;
        uint256 minSentimentThreshold;
        uint256 maxSlippage;
    }

    mapping(address => UserSettings) public userSettings;

    // Events
    event StrategyCreated(uint256 indexed strategyId, address indexed creator);
    event StrategyUpdated(uint256 indexed strategyId);
    event SignalAdded(uint256 indexed strategyId, string tokenSymbol);
    event SettingsUpdated(address indexed user);

    ITradingExecutor public tradingExecutor;
    IBridgeExecutor public bridgeExecutor;

    // Performance tracking
    struct PerformanceMetrics {
        uint256 totalTrades;
        uint256 successfulTrades;
        uint256 totalProfit; // In basis points
        uint256 averageReturn; // In basis points
        uint256 lastTradeTimestamp;
    }

    mapping(uint256 => PerformanceMetrics) public strategyPerformance;

    // Risk management
    struct RiskMetrics {
        uint256 maxDrawdown;
        uint256 volatility;
        uint256 sharpeRatio;
        uint256 lastUpdated;
    }

    mapping(uint256 => RiskMetrics) public strategyRisk;

    // Constructor
    constructor(address _tradingExecutor, address _bridgeExecutor) {
        tradingExecutor = ITradingExecutor(_tradingExecutor);
        bridgeExecutor = IBridgeExecutor(_bridgeExecutor);
        strategyCount = 0;
    }

    // Create a new strategy
    function createStrategy(
        string memory _name,
        string memory _description,
        uint8 _riskLevel
    ) external returns (uint256) {
        require(_riskLevel > 0 && _riskLevel <= 5, "Invalid risk level");
        require(bytes(_name).length > 0, "Name required");

        // Increment strategy count first to start from 1 (not 0)
        strategyCount++;
        uint256 strategyId = strategyCount;
        
        strategies[strategyId] = Strategy({
            name: _name,
            description: _description,
            riskLevel: _riskLevel,
            isActive: true,
            performance: 0,
            creator: msg.sender,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp,
            signalCount: 0
        });
        
        // Mark this strategy ID as existing
        strategyExists[strategyId] = true;
        
        // Add to the array of all strategy IDs
        allStrategyIds.push(strategyId);

        emit StrategyCreated(strategyId, msg.sender);
        return strategyId;
    }

    // Add signal to strategy
    function addSignal(
        uint256 _strategyId,
        string memory _tokenSymbol,
        uint8 _sentiment,
        uint8 _strength
    ) external {
        require(strategyExists[_strategyId], "Strategy doesn't exist");
        require(_sentiment <= 100, "Invalid sentiment");
        require(_strength > 0 && _strength <= 5, "Invalid strength");
        
        Strategy storage strategy = strategies[_strategyId];
        require(msg.sender == strategy.creator, "Not strategy creator");

        strategySignals[_strategyId][strategy.signalCount] = Signal({
            tokenSymbol: _tokenSymbol,
            sentiment: _sentiment,
            strength: _strength,
            timestamp: block.timestamp,
            isActive: true
        });
        strategy.signalCount++;

        emit SignalAdded(_strategyId, _tokenSymbol);
    }

    // Update user settings
    function updateSettings(
        uint8 _maxRiskLevel,
        bool _emailNotifications,
        bool _pushNotifications,
        uint256 _minSentimentThreshold,
        uint256 _maxSlippage
    ) external {
        require(_maxRiskLevel > 0 && _maxRiskLevel <= 5, "Invalid risk level");
        require(_minSentimentThreshold <= 100, "Invalid sentiment threshold");
        require(_maxSlippage <= 1000, "Max slippage too high"); // 10% max

        userSettings[msg.sender] = UserSettings({
            maxRiskLevel: _maxRiskLevel,
            emailNotifications: _emailNotifications,
            pushNotifications: _pushNotifications,
            minSentimentThreshold: _minSentimentThreshold,
            maxSlippage: _maxSlippage
        });

        emit SettingsUpdated(msg.sender);
    }

    // View functions
    function getStrategy(uint256 _strategyId) external view returns (
        string memory name,
        string memory description,
        uint8 riskLevel,
        bool isActive,
        uint256 performance,
        address creator,
        uint256 createdAt,
        uint256 lastUpdated,
        uint256 signalCount
    ) {
        require(strategyExists[_strategyId], "Strategy doesn't exist");
        Strategy storage strategy = strategies[_strategyId];
        
        return (
            strategy.name,
            strategy.description,
            strategy.riskLevel,
            strategy.isActive,
            strategy.performance,
            strategy.creator,
            strategy.createdAt,
            strategy.lastUpdated,
            strategy.signalCount
        );
    }

    function getSignals(uint256 _strategyId) external view returns (Signal[] memory) {
        require(strategyExists[_strategyId], "Strategy doesn't exist");
        Strategy storage strategy = strategies[_strategyId];
        
        Signal[] memory signals = new Signal[](strategy.signalCount);
        for (uint256 i = 0; i < strategy.signalCount; i++) {
            signals[i] = strategySignals[_strategyId][i];
        }
        return signals;
    }
    
    // Get all strategy IDs
    function getAllStrategyIds() external view returns (uint256[] memory) {
        return allStrategyIds;
    }

    function executeStrategyTrade(
        uint256 _strategyId,
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _minAmountOut,
        uint8 _sentiment
    ) external {
        require(strategyExists[_strategyId], "Strategy doesn't exist");
        Strategy storage strategy = strategies[_strategyId];
        require(msg.sender == strategy.creator, "Not strategy creator");

        // Check risk parameters
        UserSettings storage settings = userSettings[msg.sender];
        require(strategy.riskLevel <= settings.maxRiskLevel, "Risk too high");
        require(_sentiment >= settings.minSentimentThreshold, "Sentiment too low");

        // Execute trade
        uint256 amountOut = tradingExecutor.executeTrade(
            _tokenIn,
            _tokenOut,
            _amountIn,
            _minAmountOut,
            _sentiment
        );

        // Update performance metrics
        updatePerformanceMetrics(_strategyId, _amountIn, amountOut);
    }

    function updatePerformanceMetrics(
        uint256 _strategyId,
        uint256 _amountIn,
        uint256 _amountOut
    ) internal {
        PerformanceMetrics storage metrics = strategyPerformance[_strategyId];
        metrics.totalTrades++;
        
        if (_amountOut > _amountIn) {
            metrics.successfulTrades++;
            uint256 profit = ((_amountOut - _amountIn) * 10000) / _amountIn;
            metrics.totalProfit += profit;
        }
        
        metrics.averageReturn = metrics.totalProfit / metrics.totalTrades;
        metrics.lastTradeTimestamp = block.timestamp;

        // Update strategy performance
        strategies[_strategyId].performance = metrics.averageReturn;
    }
} 