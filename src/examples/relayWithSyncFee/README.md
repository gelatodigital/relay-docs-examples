# RelayWithSyncFee

## Smart Contracts

There are multiple examples here, varying in complexity. Let's start with the simplest.

### CounterRelayContext.sol

Please read about `GelatoRelayContext` on our docs [here](https://docs.gelato.network/developer-products/gelato-relay/quick-start/relaywithsyncfee/relay-context-contracts) as this README page is only intended for a short description detailing how to build and send a relay request.

_TL;DR:_ `GelatoRelayContext` appends the `feeCollector` address, the `feeToken` address and the `fee` value to the relay calldata so that your target function can access them when being called. `GelatoRelayFeeCollector` appends only the `feeCollector` address.

We have deployed a simple counter contract to many networks for your testing purposes, please see [here](https://blockscan.com/address/0x730615186326cF8f03E34a2B49ed0f43A38c0603) for a reference list.

This simple counter contract inherits [`GelatoRelayContext`](https://github.com/gelatodigital/relay-context-contracts) to gain access to some super useful helper functions that we have made for you:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { GelatoRelayContext } from "@gelatonetwork/relay-context/contracts/GelatoRelayContext.sol";

// Inheriting GelatoRelayContext gives access to:
// 1. _getFeeCollector(): returns the address of Gelato's feeCollector
// 2. _getFeeToken(): returns the address of the fee token
// 3. _getFee(): returns the fee to pay
// 4. _transferRelayFee(): transfers the required fee to Gelato's feeCollector.abi
// 5. _transferRelayFeeCapped(uint256 maxFee): transfers the fee to Gelato, IF fee < maxFee
// 6. __msgData(): returns the original msg.data without appended information
// 7. onlyGelatoRelay modifier: allows only Gelato Relay's smart contract to call the function
contract CounterRelayContext is GelatoRelayContext {
  uint256 public counter;

  event IncrementCounter(uint256 newCounterValue);

  // this function increments a counter after paying Gelato successfully
  function increment() external onlyGelatoRelay {
    // transfer fees to Gelato
    _transferRelayFee();

    counter++;
    emit IncrementCounter(counter);
  }
}

```

This simple counter contract inherits `GelatoRelayContext` to specifically benefit from the `_transferRelayFee` function. This function provides a succinct way to add payment logic to your target smart contract which facilitates payment directly to Gelato during the call forward. This payment method is only applicable when using the `relayWithSyncFee` SDK method. For more information on `GelatoRelayContext`, please see [here](https://docs.gelato.network/developer-products/gelato-relay/quick-start/relaywithsyncfee/relay-context-contracts). This counter contract has one target function `increment`. A useful way of checking on our relay call is looking out for the `IncrementCounter` event on-chain after we submit our relay request. We can also track the relay request using the status tracker, read more [here](https://docs.gelato.network/developer-products/gelato-relay/quick-start/tracking-your-relay-request).

### CounterFeeCollector.sol

Please read the docs [here](https://docs.gelato.network/developer-products/gelato-relay/quick-start/relaywithsyncfee/relay-context-contracts#gelatorelayfeecollector) about the semantic differences between `GelatoRelayContext` and `GelatoRelayFeeCollector`.

_TL;DR:_ `GelatoRelayContext` appends the `feeCollector` address, the `feeToken` address and the `fee` value to the relay calldata so that your target function can access them when being called. `GelatoRelayFeeCollector` appends only the `feeCollector` address.

`GelatoRelayFeeCollector` gives access to the `feeCollector` address from the incoming calldata to which your target contract should pay.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { GelatoRelayFeeCollector } from "@gelatonetwork/relay-context/contracts/GelatoRelayFeeCollector.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";

// Inheriting GelatoRelayFeeCollector gives access to:
// 1. _getFeeCollector(): returns the address of Gelato's feeCollector
// 2. __msgData(): returns the original msg.data without feeCollector appended
// 3. onlyGelatoRelay modifier: allows only Gelato Relay's smart contract to call the function
contract CounterFeeCollector is GelatoRelayFeeCollector {
  using Address for address payable;

  uint256 public counter;

  event IncrementCounter(uint256 newCounterValue);

  // `increment` is the target function to call
  // this function increments the state variable `counter` by 1
  function increment() external onlyGelatoRelay {
    // Payment to Gelato
    // NOTE: be very careful here!
    // if you do not use the onlyGelatoRelay modifier,
    // anyone could encode themselves as the fee collector
    // in the low-level data and drain tokens from this contract.
    payable(_getFeeCollector()).sendValue(100);

    counter++;

    emit IncrementCounter(counter);
  }
}

```

### MyDummyWallet.sol

`MyDummyWallet.sol` is a simple smart contract wallet. It is used to illustrate more real-world use cases of Gelato Relay, now that you have got the hang of things with `Counter.sol` and `CounterERC2771.sol`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

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

The first line imports `GelatoRelayContext` from our [relay-context](https://www.npmjs.com/package/@gelatonetwork/relay-context) package. To read in detail about this, please visit the [docs](https://docs.gelato.network/developer-products/gelato-relay/quick-start/relaywithsyncfee/relay-context-contracts). In brief, inheriting the `GelatoRelayContext` contract gives you access to information that Gelato appends to the end of your target payload, so that you can access important variables from within your target function during the relay call. These variables are:

- address `feeCollector`: the address of Gelato's fee collector contract to which the relay fee should be paid to
- address `feeToken`: the address of the token you have requested to pay in
- uint256 `fee`: the fee amount to be paid to the `feeCollector` address.

In case, you already possess the fee beforehand by querying our [fee oracle](https://docs.gelato.network/developer-products/gelato-relay/quick-start/gelatos-fee-oracle), you can inherit `GelatoRelayFeeCollector` (see the relevant page on the docs [here](https://docs.gelato.network/developer-products/gelato-relay/quick-start/relaywithsyncfee/relay-context-contracts#gelatorelayfeecollector)) instead.

## Building and Sending a Relay Request

### increment.ts

Located at `src/examples/relayWithSyncFee/increment.ts`, you will find a script which allows you to call the `increment` function on the counter contract via Gelato Relay.

To run this script, run the following command in your terminal:

```
npx hardhat run src/examples/relayWithSyncFee/counter/increment.ts
```

You should see an output similar to this, with your unique Gelato Relay task ID and some useful links to click on:

```
Sending Gelato Relay request with parameters:

* Target contract: 0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27
* Data: 0xd09de08a
* FeeToken: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE


🍦--------------------------------------------------------------------------🍦

🎉 Request sent successfully 🎉

Your relay task ID is 0x9b4e77e4f7ee23d3db8cd9bd88b6655fa1e22e69eaa280d5744d64e7710630fd


Click here to see more details from our status API:
* https://relay.gelato.digital/tasks/status/0x9b4e77e4f7ee23d3db8cd9bd88b6655fa1e22e69eaa280d5744d64e7710630fd/

🍦--------------------------------------------------------------------------🍦

Click here to see your relayed message on-chain!:
https://goerli.etherscan.io/address/0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27/#events
```

#### Script Walkthrough

This script has two main steps: 1. building a relay request object and 2. sending a relay request using Gelato Relay SDK.

#### Step 1. Building a Relay Request

`buildIncrementRequest` builds a relay request object for [relayWithSyncFee](https://docs.gelato.network/developer-products/gelato-relay/quick-start/relaywithsyncfee#sending-a-request).

```typescript
const request: SyncFeeRequest = {
  chainId: 5, // Goerli,
  target: counter,
  data: data as BytesLike,
  feeToken: feeToken,
};
```

#### Step 2. Sending a Relay Request

`sendRelayRequest` takes the request object and uses our relay SDK to send it to Gelato:

```typescript
const relayResponse = await GelatoRelaySDK.relayWithSyncFee(request);
```

The `relayResponse` object is simply:

```typescript
type RelayResponse = {
  taskId: string;
};
```

You can track your relay task by visiting the relevant page [here](https://docs.gelato.network/developer-products/gelato-relay/quick-start/tracking-your-relay-request) in the docs.

### emitBalance.ts

Located at `src/examples/relayWithSyncFee/emitBalance.ts`, you will find a script which allows you to call the `emitBalance` function on the myDummyWallet contract.

To run this script, run the following command in your terminal:

```
npx hardhat run src/examples/relayWithSyncFee/myDummyWallet/emitBalance.ts
```

```
Sending Gelato Relay request with parameters:

- Target contract: 0xA045eb75e78f4988d42c3cd201365bDD5D76D406
- Data: 0xa9cc0927
- FeeToken: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE

🍦--------------------------------------------------------------------------🍦

🎉 Request sent successfully 🎉

Your relay task ID is 0x971f138a79fb46d3c4078b2448533831441ddb6568a7991c4902d6e9562c1cf5

Click here to see more details from our status API:

- https://relay.gelato.digital/tasks/status/0x971f138a79fb46d3c4078b2448533831441ddb6568a7991c4902d6e9562c1cf5/

🍦--------------------------------------------------------------------------🍦

Click here to see your relayed message on-chain!:
https://goerli.etherscan.io/address/0xA045eb75e78f4988d42c3cd201365bDD5D76D406/#events
```

#### Script Walkthrough

This script has two main steps: 1. building a relay request object and 2. sending a relay request using Gelato Relay SDK.

#### Step 1. Building a Relay Request

`buildEmitBalanceRequest` builds a relay request object for [relayWithSyncFee](https://docs.gelato.network/developer-products/gelato-relay/quick-start/relaywithsyncfee#sending-a-request).

```typescript
const request: SyncFeeRequest = {
  chainId: 5, // Goerli
  target: myDummyWallet,
  data: data as BytesLike,
  feeToken: feeToken,
};
```

#### Step 2. Sending a Relay Request

`sendRelayRequest` takes the request object and uses our relay SDK to send it to Gelato:

```typescript
const relayResponse = await GelatoRelaySDK.relayWithSyncFee(request);
```

The `relayResponse` object is simply:

```typescript
type RelayResponse = {
  taskId: string;
};
```

### sendToFriend.ts

Located at `src/examples/relayWithSyncFee/sendToFriend.ts`, you will find a script which allows you to call the `sendToFriend` function on the counter contract.

To run this script, run the following command in your terminal:

```
npx hardhat run src/examples/relayWithSyncFee/myDummyWallet/sendToFriend.ts
```

You should see an output similar to this, with your unique Gelato Relay task ID and some useful links to click on:

```
Sending Gelato Relay request with parameters:

* Target contract: 0xA045eb75e78f4988d42c3cd201365bDD5D76D406
* Data: 0xae53dcae000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000da9644c2c2b6f50426eaba9ce1b853e99f2d4fca000000000000000000000000000000000000000000000000002386f26fc10000
* FeeToken: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE


🍦--------------------------------------------------------------------------🍦

🎉 Request sent successfully 🎉

Your relay task ID is 0x0b26a17c8ca996ef317ea5aa0ec8842a71c888589c17a2a78b34e1e18449a34a


Click here to see more details from our status API:
* https://relay.gelato.digital/tasks/status/0x0b26a17c8ca996ef317ea5aa0ec8842a71c888589c17a2a78b34e1e18449a34a/

🍦--------------------------------------------------------------------------🍦

Click here to see your relayed message on-chain!:
https://goerli.etherscan.io/address/0xA045eb75e78f4988d42c3cd201365bDD5D76D406/#events
```

#### Script Walkthrough

This script has two main steps: 1. building a relay request object and 2. sending a relay request using Gelato Relay SDK.

#### Step 1. Building a Relay Request

`buildSendToFriendRequest` builds a relay request object for [relayWithSyncFee](https://docs.gelato.network/developer-products/gelato-relay/quick-start/relaywithsyncfee#sending-a-request).

```typescript
const request: SyncFeeRequest = {
  chainId: 5, // Goerli
  target: myDummyWallet,
  data: data as BytesLike,
  feeToken: feeToken,
};
```

#### Step 2. Sending a Relay Request

`sendRelayRequest` takes the request object and uses our relay SDK to send it to Gelato:

```typescript
const relayResponse = await GelatoRelaySDK.relayWithSyncFee(request);
```

The `relayResponse` object is simply:

```typescript
type RelayResponse = {
  taskId: string;
};
```

### Well done! You have the knowledge

That's it! These scripts show you exactly how to send a `relayWithSyncFee` request for three different example target functions and how to use `GelatoRelayContext` (NPM package [here](https://www.npmjs.com/package/@gelatonetwork/relay-context)) to get started with Gelato Relay in no time.

Next up: let's try relayWithSponsoredUserAuthCall.
