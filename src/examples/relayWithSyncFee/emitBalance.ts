// local imports
import { SyncFeeRequest } from "../../types";
import { getDeploymentAddress } from "../../utils";
import { relayLogger } from "./relayLogger";

// package imports
import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";
import { BytesLike } from "ethers";

// this function builds the relay request object to send using GelatoRelaySDK
// to call the `emitBalance` function on the myDummyWallet contract.
// supported testnets:
// "goerli", "mumbai"
// example: ts-node src/examples/relayWithSyncFee/emitBalance.ts goerli
const buildEmitBalanceRequest = (): SyncFeeRequest => {
  // target contract address
  const myDummyWallet = getDeploymentAddress("myDummyWallet");

  const data = "0xa9cc0927"; // `emitBalance` function signature
  const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // pay Gelato in native token

  // populate the relay SDK request body
  const request: SyncFeeRequest = {
    chainId: 5, // Goerli
    target: myDummyWallet,
    data: data as BytesLike,
    feeToken: feeToken,
  };
  return request;
};

const sendRelayRequest = async () => {
  // building the request object
  const request = buildEmitBalanceRequest();

  // using Gelato Relay SDK to send a relay request!
  const relayResponse = await GelatoRelaySDK.relayWithSyncFee(request);
  relayLogger(request, relayResponse);
};

sendRelayRequest();
