### CounterERC2771.sol

To demonstrate how to make your contract ERC-2771 compatible using OpenZeppelin's [ERC2771Context](https://docs.openzeppelin.com/contracts/4.x/api/metatx), we have modified our counter contract and deployed it on many [networks](https://blockscan.com/address/0x30d97B13e29B0cd42e6ebd48dbD9063465bF1997) for your testing.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { ERC2771Context } from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

// Inheriting ERC2771Context gives access to:
// 1. isTrustedForwarder(), returns true if the address is the trustedForwarder
// 2. _msgSender() - function to retrieve original off-chain sender by
// taking last 20 bytes of calldata.
contract CounterERC2771 is ERC2771Context {
  // A mapping of a counter to each _msgSender()
  mapping(address => uint256) public contextCounter;

  event IncrementContextCounter(address _msgSender);

  // a modifier which utilises `isTrustedForwarder` for security.
  modifier onlyTrustedForwarder() {
    require(
      isTrustedForwarder(msg.sender),
      "Only callable by Trusted Forwarder"
    );
    _;
  }

  // Setting the trustedForwarder upon contract deployment
  //solhint-disable-next-line no-empty-blocks
  constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

  // `incrementContext` is the target function to call
  // this function increments the counter mapped to the _msgSender
  function incrementContext() external onlyTrustedForwarder {
    address _msgSender = _msgSender();

    contextCounter[_msgSender]++;

    // Emitting an event for testing purposes
    emit IncrementContextCounter(_msgSender);
  }
}

```

`CounterERC2771.sol` is an [ERC-2771](https://docs.gelato.network/developer-products/gelato-relay-sdk/prerequisites#erc-2771) compatible counter contract. What does this compatibility mean in practice?

In practice, ERC-2771 allows `target` smart contracts to permission the calling of a function based on the trusted forwarder and the orignator of the request off-chain (whose identity is verified using signature validation by the Gelato Relay smart contract).

1. ERC-2771 `_msgSender` retrieval from the calldata. `_msgSender` is the address of the originator of the relay request. This is data from off-chain which Gelato Relay encodes onto the end of the calldata when executing the message on chain.
2. ERC-2771 `trustedForwarder` which, in this case, is the address of Gelato Relay (`0xaBcC9b596420A9E9172FD5938620E265a0f9Df92`), which is used as a modifier for a target function. This means only the trusted forwarder can call the required function.

The `target` function `incrementContext` is very similar to `Counter.sol` but it will only increment the counter for each `_msgSender`.
