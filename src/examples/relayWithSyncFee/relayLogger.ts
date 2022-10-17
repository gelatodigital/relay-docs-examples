import { SyncFeeRequest, RelayResponse } from "../../types";
import { getDeploymentAddress } from "../../utils";

export const relayLogger = async (
  request: SyncFeeRequest,
  relayResponse: RelayResponse
) => {
  // log Gelato relay parameters
  console.log("\n");
  console.log("\n");
  console.log("Sending Gelato Relay request with parameters: " + "\n");
  console.log(`* Target contract: ${request.target}`);
  console.log(`* Data: ${request.data}`);
  console.log(`* FeeToken: ${request.feeToken}`);
  console.log("\n");
  console.log(
    "🍦--------------------------------------------------------------------------🍦" +
      "\n"
  );

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

  const contract = getDeploymentAddress("counter");

  console.log("Click here to see your relayed message on-chain!: ");
  console.log(`https://goerli.etherscan.io/address/${contract}/#events`);
  console.log("\n");
  console.log("Command + double click on the links above if you are on MacOS!");
  console.log("\n");
};
