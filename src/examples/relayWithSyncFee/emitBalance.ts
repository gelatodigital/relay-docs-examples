// local imports
import { SyncFeeRequest } from "../../types";
import {
  getDeploymentAddress,
  getSupportedChainId,
  getEtherscanURL,
} from "../../utils";

// package imports
import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";
import { BytesLike } from "ethers";

// this function builds the relay request object to send using GelatoRelaySDK
// to call the `emitBalance` function on the myDummyWallet contract.
// supported testnets:
// "goerli", "mumbai"
// example: ts-node src/examples/relayWithSyncFee/emitBalance.ts goerli
const buildRequest = async (network: string): Promise<SyncFeeRequest> => {
  // target contract address
  const myDummyWallet = getDeploymentAddress("myDummyWallet");
  const chainId = getSupportedChainId(network);

  const data = "0xa9cc0927"; // `emitBalance` function signature
  const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // pay Gelato in native token

  // populate the relay SDK request body
  const request: SyncFeeRequest = {
    chainId: chainId,
    target: myDummyWallet,
    data: data as BytesLike,
    feeToken: feeToken,
  };
  return request;
};

// this function sends the relay request object generated using buildRequest(network)
const sendRelayRequest = async () => {
  // get network from argument
  const network = process.argv[2];
  // build relay request object
  const request = await buildRequest(network);

  // log Gelato relay parameters
  console.log("\n");
  console.log("Sending Gelato Relay request with parameters: " + "\n");
  console.log(`* Requested network: ${network} `);
  console.log(`* Target contract: ${request.target}`);
  console.log(`* Data: ${request.data}`);
  console.log(`* FeeToken: ${request.feeToken}`);
  console.log("\n");
  console.log(
    "🍦--------------------------------------------------------------------------🍦" +
      "\n"
  );

  // the all-important GelatoRelaySDK call!
  const relayResponse = await GelatoRelaySDK.relayWithSyncFee(request);

  console.log(
    `🎉 Request sent successfully 🎉, your relay task ID is ${relayResponse.taskId}` +
      "\n"
  );
  console.log("Click here to see more details from our status API:");
  console.log(
    `* https://relay.gelato.digital/tasks/status/${relayResponse.taskId}/` +
      "\n"
  );

  console.log(
    "🍦--------------------------------------------------------------------------🍦" +
      "\n"
  );

  const URL = getEtherscanURL(network);
  const contract = getDeploymentAddress("myDummyWallet");

  console.log("Click here to see your relayed message on-chain!: ");
  console.log(`${URL}/${contract}/#events`);
  console.log("\n");
  console.log("Command + double click on the links above if you are on MacOS!");
  console.log("\n");
};

// let's get rolling!
sendRelayRequest();
