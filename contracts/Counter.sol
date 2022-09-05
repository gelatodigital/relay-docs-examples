// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {
    RelayerContext
} from "@gelatonetwork/relayer-context/contracts/RelayerContext.sol";

contract Counter is RelayerContext {
    uint256 public counter;

    event IncrementCounter();

    //solhint-disable-next-line no-empty-blocks
    constructor(address relayer) RelayerContext(relayer) {}

    function increment() external onlyRelayer {
        // payment
        _uncheckedTransferToFeeCollectorUncapped();

        // logic
        counter += 1;
        emit IncrementCounter();
    }

    function currentCounter() external view returns (uint256) {
        return counter;
    }
}
