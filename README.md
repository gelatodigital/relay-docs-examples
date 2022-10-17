# Relay Docs Examples

- This repo contains the contracts used for code examples in the [Relay SDK docs](https://docs.gelato.network/developer-products/gelato-relay-sdk).
- This repo is intended as something you can clone and get started with local testing straight away, but bear in mind, this is a WIP.

## Getting Started

Clone this repo:

- `git clone https://github.com/gelatodigital/relay-docs-examples`

Install the packages locally and configure everything with:

- `yarn build`

You are ready to move on to the code examples which interest you most! They are categorised by the [relay SDK methods](https://docs.gelato.network/developer-products/gelato-relay-sdk/sdk-methods):

## RelayWithSyncFee

### Smart Contracts

There are multiple examples here, varying in complexity. Let's start with the simplest.

#### Counter.sol

On [Goerli](https://goerli.etherscan.io/address/0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27) and [Mumbai](https://mumbai.polygonscan.com/address/0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27), there is a simple counter contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import { GelatoRelayContext } from "@gelatonetwork/relay-context/contracts/GelatoRelayContext.sol";

contract Counter is GelatoRelayContext {
  uint256 public counter;

  event IncrementCounter();

  function increment() external onlyGelatoRelay {
    // payment to Gelato
    _transferRelayFee();

    counter += 1;
    emit IncrementCounter();
  }
}

```

This simple counter contract inherits `GelatoRelayContext` to benefit from the `_transferRelayFee` function. This function provides a succinct way to add payment logic which facilitates payment directly to Gelato during the call forward. This payment method is only applicable when using the `relayWithSyncFee` SDK method. For more information on `GelatoRelayContext`, please see [here](https://docs.gelato.network/developer-products/gelato-relay-sdk/prerequisites#gelatos-relay-context).

This counter contract has one target function `increment`. A useful way of checking on our relay call is looking out for the `IncrementCounter` event on-chain after we submit our relay request.

#### CounterERC2771.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

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

#### MyDummyWallet.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import { GelatoRelayContext } from "@gelatonetwork/relay-context/contracts/GelatoRelayContext.sol";

import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { IERC20, SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { NATIVE_TOKEN } from "./constants/Tokens.sol";

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

```

### Typescript

#### emitBalance

Located at `src/examples/relayWithSyncFee/emitBalance.ts`, you will find a script which allows you to call `emitBalance
