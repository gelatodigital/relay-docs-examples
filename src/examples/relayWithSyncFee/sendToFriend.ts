// local imports
import { SyncFeeRequest } from "../../types";
import { getDeploymentAddress } from "../../utils";
import { relayLogger } from "./relayLogger";

// package imports
import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";
import { ethers, BytesLike } from "ethers";

// environment variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
const ALCHEMY_ID = process.env.ALCHEMY_ID;

// this function builds the relay request object to send using GelatoRelaySDK
// to call the `sendToFriend` function on the myDummyWallet contract.
// supported testnets:
// "goerli", "mumbai"
// example: ts-node src/examples/relayWithSyncFee/sendToFriend.ts goerli
const buildSendToFriendRequest = async (): Promise<SyncFeeRequest> => {
  // target contract address
  const myDummyWallet = getDeploymentAddress("myDummyWallet");

  // using a human-readable ABI for generating the payload
  const abi = [
    "function sendToFriend(address _token, address _to, uint256 _amount)",
  ];

  // // sendToFriend arguments
  const friend = "0xDA9644C2c2B6F50426EaBa9ce1B853e99f2D4fCa";
  const amountToSend = ethers.utils.parseUnits("0.01");
  const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  // ethers.js specific naming for mumbai testnet
  // connect to the blockchain via a provider
  const provider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_ID);

  // generate the target payload
  const contract = new ethers.Contract(myDummyWallet, abi, provider);
  const { data } = await contract.populateTransaction.sendToFriend(
    feeToken,
    friend,
    amountToSend
  );

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
  const request = await buildSendToFriendRequest();

  // using Gelato Relay SDK to send a relay request!
  const relayResponse = await GelatoRelaySDK.relayWithSyncFee(request);
  relayLogger(request, relayResponse);
};

sendRelayRequest();
