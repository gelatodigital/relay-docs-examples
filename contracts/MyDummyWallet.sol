// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {
    GelatoRelayContext
} from "@gelatonetwork/relay-context/contracts/GelatoRelayContext.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {
    SafeERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyDummyWallet is GelatoRelayContext {
    event LogSendToFriend(address indexed to, uint256 amount);

    function sendToFriend(
        address _token,
        address _to,
        uint256 _amount
    ) external onlyGelatoRelay {
        // payment to Gelato
        _transferRelayFee();

        // transfer of ERC-20 tokens
        SafeERC20.safeTransfer(IERC20(_token), _to, _amount);

        emit LogSendToFriend(_to, _amount);
    }
}
