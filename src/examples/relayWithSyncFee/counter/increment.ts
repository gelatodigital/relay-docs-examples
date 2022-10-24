// local imports
import { SyncFeeRequest } from "../../../types";
import { getDeploymentAddress } from "../../../utils";
import { relayLogger } from "../utils/relayLogger";
import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";

// package imports
import { BytesLike } from "ethers";

// target contract address
const counter = getDeploymentAddress("CounterRelayContext");

// this function builds the relay request object to send using GelatoRelaySDK
// to call the `increment` function on the counter contract.
// run with: ts-node src/examples/relayWithSyncFee/increment.ts goerli
const buildIncrementRequest = (): SyncFeeRequest => {
  const data = "0xd09de08a"; // increment function signature
  const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // pay Gelato in native token

  // populate the relay SDK request body
  const request: SyncFeeRequest = {
    chainId: 5, // Goerli,
    target: counter,
    data: data as BytesLike,
    feeToken: feeToken,
  };
  return request;
};

const sendRelayRequest = async (request: SyncFeeRequest) => {
  // using Gelato Relay SDK to send a relay request!
  const relayResponse = await GelatoRelaySDK.relayWithSyncFee(request);
  relayLogger(counter, request, relayResponse);
};

const request = buildIncrementRequest();
sendRelayRequest(request);
