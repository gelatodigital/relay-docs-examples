// local imports
import { SyncFeeRequest } from "../../types";
import {
  getDeploymentAddress,
  getSupportedChainId,
  getEtherscanURL,
} from "../../utils";

// package imports
import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";
import { ethers, BytesLike } from "ethers";

// environment variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
const ALCHEMY_ID = process.env.ALCHEMY_ID;

const buildRequest = async (network: string): Promise<SyncFeeRequest> => {
  // target contract address
  const myDummyWallet = getDeploymentAddress("myDummyWallet");
  const chainId = getSupportedChainId(network);

  // using a human-readable ABI for generating the payload
  const abi = [
    "function sendToFriend(address _token, address _to, uint256 _amount)",
  ];

  // // sendToFriend arguments
  const friend = "0xDA9644C2c2B6F50426EaBa9ce1B853e99f2D4fCa";
  const amountToSend = ethers.utils.parseUnits("0.01");
  const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  // connect to the blockchain via a provider
  if (network == "mumbai") {
    network = "maticmum";
  }
  const provider = new ethers.providers.AlchemyProvider(network, ALCHEMY_ID);

  // generate the target payload
  const contract = new ethers.Contract(myDummyWallet, abi, provider);
  const { data } = await contract.populateTransaction.sendToFriend(
    feeToken,
    friend,
    amountToSend
  );

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

  console.log(`🎉 Request sent successfully 🎉` + "\n");
  console.log(`Your relay task ID is ${relayResponse.taskId}`);
  console.log("\n");
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
