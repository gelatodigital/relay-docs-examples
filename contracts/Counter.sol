// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {
    GelatoRelayContext
} from "@gelatonetwork/relay-context/contracts/GelatoRelayContext.sol";

// Inheriting GelatoRelayContext gives access to:
// 1. onlyGelatoRelayModifier
// 2. payment methods, i.e. _transferRelayFee
// 3. _getFeeCollector(), _getFeeToken(), _getFee()
contract Counter is GelatoRelayContext {
    uint256 public counter;

    event IncrementCounter();

    // `increment` is the target function to call
    // this function increments the state variable `counter` by 1
    function increment() external onlyGelatoRelay {
        // Payment to Gelato
        // NOTE: be very careful here!
        // if you do not use the onlyGelatoRelay modifier,
        // anyone could encode themselves as the fee collector
        // in the low-level data and drain tokens from this contract.
        _transferRelayFee();

        counter += 1;

        // Emitting an event for testing purposes
        emit IncrementCounter();
    }
}
