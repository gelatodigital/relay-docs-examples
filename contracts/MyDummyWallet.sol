// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {
    GelatoRelayContext
} from "@gelatonetwork/relay-context/contracts/GelatoRelayContext.sol";

import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {
    IERC20,
    SafeERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {NATIVE_TOKEN} from "./constants/Tokens.sol";

// Importing GelatoRelayContext gives access to:
// 1. onlyGelatoRelayModifier
// 2. payment methods, i.e. _transferRelayFee
// 3. _getFeeCollector(), _getFeeToken(), _getFee()
contract MyDummyWallet is GelatoRelayContext {
    using Address for address payable;
    using SafeERC20 for IERC20;

    // emitting an event for testing purposes
    event LogSendToFriend(address indexed to, uint256 amount);
    event LogBalance(uint256 indexed balance);

    // this function uses this contract's ERC-20 token balance to send
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

        // transfer of tokens
        if (_token == NATIVE_TOKEN) payable(_to).sendValue(_amount);
        else IERC20(_token).safeTransfer(_to, _amount);

        emit LogSendToFriend(_to, _amount);
    }

    // this functions emits the current balance of the wallet contract
    // in an event that we can check on-chain.
    function emitBalance() external onlyGelatoRelay {
        // Payment to Gelato
        // NOTE: be very careful here!
        // if you do not use the onlyGelatoRelay modifier,
        // anyone could encode themselves as the fee collector
        // in the low-level data and drain tokens from this contract.
        _transferRelayFee();

        emit LogBalance(address(this).balance);
    }
}
