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

This contract inherits `GelatoRelayContext` to benefit from the `_transferRelayFee` function. This function provides a succinct way to add payment logic which facilitates payment directly to Gelato during the call forward. This payment method is only applicable when using the `relayWithSyncFee` SDK method. For more information on `GelatoRelayContext`, please see [here](https://docs.gelato.network/developer-products/gelato-relay-sdk/prerequisites#gelatos-relay-context).

This counter contract has one function `increment`, which we shall call using the Gelato Relay SDK! In this case, we are checking that the `IncrementCounter` event is emitted on-chain after we submit our relay request.

#### CounterERC2771.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import { ERC2771Context } from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract CounterERC2771 is ERC2771Context {
  mapping(address => uint256) public contextCounter;

  event IncrementContextCounter(address _msgSender);

  modifier onlyTrustedForwarder() {
    require(
      isTrustedForwarder(msg.sender),
      "Only callable by Trusted Forwarder"
    );
    _;
  }

  //solhint-disable-next-line no-empty-blocks
  constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

  function incrementContext() external onlyTrustedForwarder {
    address _msgSender = _msgSender();

    contextCounter[_msgSender]++;
    emit IncrementContextCounter(_msgSender);
  }

  function currentContextCounter(address _msgSender)
    external
    view
    returns (uint256)
  {
    return contextCounter[_msgSender];
  }
}

```

#### MyDummyWallet.sol

### Typescript

#### emitBalance

Located at `src/examples/relayWithSyncFee/emitBalance.ts`, you will find a script which allows you to call `emitBalance
