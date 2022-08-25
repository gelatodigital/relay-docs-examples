// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

interface IGelato1Balance {
    event LogUseGelato1Balance(
        address indexed sponsor,
        address indexed target,
        address indexed feeToken,
        uint256 sponsorChainId,
        uint256 nativeToFeeTokenXRateNumerator,
        uint256 nativeToFeeTokenXRateDenominator,
        bytes32 taskId
    );
}
