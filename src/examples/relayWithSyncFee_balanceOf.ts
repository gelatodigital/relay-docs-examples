// local imports
import { SyncFeeRequest } from "../types";
import { getDeploymentAddress } from "../utils";

// package imports
import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";
import { BytesLike } from "ethers";

const buildRequest = async (): Promise<SyncFeeRequest> => {
  // target contract address
  const myDummyWallet = getDeploymentAddress("myDummyWallet");

  // using a human-readable ABI for generating the payload
  // const abi = [
  //   "function sendToFriend(address _token, address _to, uint256 _amount)",
  // ];

  // balanceOf arguments
  const data = "0x722713f7"; // `balanceOf` function signature
  const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  // sendToFriend arguments
  // const vitalik = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
  // const amountToSend = ethers.utils.parseUnits("0.05");

  // connect to the blockchain via a provider
  // const provider = new ethers.providers.AlchemyProvider();

  // generate the target payload
  // const signer = provider.getSigner();
  // const contract = new ethers.Contract(myDummyWallet, abi, signer);
  // const { data } = await contract.populateTransaction.sendToFriend(
  //   feeToken,
  //   vitalik,
  //   amountToSend
  // );

  // const { data } = await contract.populateTransaction.balanceOf();

  // populate the relay SDK request body
  const request: SyncFeeRequest = {
    chainId: 5,
    target: myDummyWallet,
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
