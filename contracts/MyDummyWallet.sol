// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {
    GelatoRelayContext
} from "@gelatonetwork/relay-context/contracts/GelatoRelayContext.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {
    SafeERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Importing GelatoRelayContext gives access to:
// 1. onlyGelatoRelayModifier
// 2. payment methods, i.e. _transferRelayFee
// 3. _getFeeCollector(), _getFeeToken(), _getFee()
contract MyDummyWallet is GelatoRelayContext {
    // emitting an event for testing purposes
    event LogSendToFriend(address indexed to, uint256 amount);

    // this function uses this contract's mock ERC-20 balance to send
    // an _amount of tokens to the _to address
    function sendToFriend(
        address _token,
        address _to,
        uint256 _amount
    ) external onlyGelatoRelay {
        // Payment to Gelato
        // NOTE: be very careful here!
        // if you do not use the onlyGelatoRelay modifier,
        // anyone could encode themselves as the fee collector
        // in the low-level data and drain tokens from this contract.
        _transferRelayFee();

        // transfer of ERC-20 tokens
        SafeERC20.safeTransfer(IERC20(_token), _to, _amount);

        emit LogSendToFriend(_to, _amount);
    }
}
