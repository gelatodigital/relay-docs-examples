// local imports
import { SyncFeeRequest } from "../types";
import { getDeploymentAddress } from "../utils";

// package imports
import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";
import { BytesLike } from "ethers";

const buildRequest = async (): Promise<SyncFeeRequest> => {
  // target contract address
  const counter = getDeploymentAddress("counter");

  // increment function signature
  const data = "0xd09de08a"; // `balanceOf` function signature
  const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  // populate the relay SDK request body
  const request: SyncFeeRequest = {
    chainId: 5, // goerli
    target: counter,
    data: data as BytesLike,
    feeToken: feeToken,
  };
  return request;
};

const sendRelayRequest = async () => {
  const request = await buildRequest();

  // send relayRequest to Gelato Relay API
  const relayResponse = await GelatoRelaySDK.relayWithSyncFee(request);
  console.log(relayResponse);
};

// let's get rolling!
sendRelayRequest();
