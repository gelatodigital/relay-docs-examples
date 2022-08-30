// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {
    RelayerContext
} from "@gelatonetwork/relayer-context/contracts/RelayerContext.sol";

contract Counter is RelayerContext {
    uint256 public count;

    event IncrementCounter(uint256 indexed by);

    //solhint-disable-next-line no-empty-blocks
    constructor(address relayer) RelayerContext(relayer) {}

    function incrementCounter(uint256 _by) external onlyRelayer {
        // payment
        _uncheckedTransferToFeeCollectorUncapped();

        // logic
        count += _by;
        emit IncrementCounter(_by);
    }

    function current() external view returns (uint256) {
        return count;
    }
}
