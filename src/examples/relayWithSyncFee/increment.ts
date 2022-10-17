// local imports
import { SyncFeeRequest } from "../../types";
import { getDeploymentAddress } from "../../utils";
import { relayLogger } from "./relayLogger";
import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";

// package imports
import { BytesLike } from "ethers";

// this function builds the relay request object to send using GelatoRelaySDK
// to call the `increment` function on the counter contract.
// argument: network name as a string
// supported testnets:
// "goerli", "mumbai"
// example: ts-node src/examples/relayWithSyncFee/increment.ts goerli
const buildIncrementRequest = (): SyncFeeRequest => {
  // target contract address
  const counter = getDeploymentAddress("counter");

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
  relayLogger(request, relayResponse);
};

const request = buildIncrementRequest();
sendRelayRequest(request);
