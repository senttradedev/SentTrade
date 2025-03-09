// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IDeBridgeGate {
    struct SubmissionAutoParamsTo {
        uint256 executionFee;
        uint256 flags;
        bytes data;
        bytes fallbackAddress;
    }

    function globalFixedNativeFee() external view returns (uint256);
    function send(
        address _tokenAddress,
        uint256 _amount,
        uint256 _chainIdTo,
        bytes memory _receiver,
        bytes memory _permit,
        bool _useAssetFee,
        uint32 _referralCode,
        bytes memory _autoParams
    ) external payable;
}

contract BridgeExecutor {
    IDeBridgeGate public deBridgeGate;
    address public strategyManager;
    
    // Chain IDs for supported networks
    mapping(uint256 => bool) public supportedChains;
    
    constructor(address _deBridgeGate) {
        deBridgeGate = IDeBridgeGate(_deBridgeGate);
    }

    // Execute cross-chain strategy
    function executeStrategy(
        uint256 _chainIdTo,
        address _receiver,
        bytes memory _callData
    ) external payable {
        require(supportedChains[_chainIdTo], "Unsupported chain");
        
        // Get protocol fee
        uint256 protocolFee = deBridgeGate.globalFixedNativeFee();
        require(msg.value >= protocolFee, "Insufficient fee");

        // Prepare auto params
        IDeBridgeGate.SubmissionAutoParamsTo memory autoParams;
        autoParams.executionFee = 0; // No execution fee for now
        autoParams.flags = 1; // Set PROXY_WITH_SENDER flag
        autoParams.data = _callData;
        autoParams.fallbackAddress = abi.encodePacked(msg.sender);

        // Send cross-chain transaction
        deBridgeGate.send{value: protocolFee}(
            address(0), // No token transfer
            0, // No amount
            _chainIdTo,
            abi.encodePacked(_receiver),
            "", // No permit
            true, // Use asset fee
            0, // No referral code
            abi.encode(autoParams)
        );
    }

    // Admin functions to manage supported chains
    function addSupportedChain(uint256 _chainId) external {
        supportedChains[_chainId] = true;
    }

    function removeSupportedChain(uint256 _chainId) external {
        supportedChains[_chainId] = false;
    }
} 