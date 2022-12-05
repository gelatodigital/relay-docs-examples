import { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { sleep } from "../src/utils";
import { getRelayV0Addresses } from "../src/addresses";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer, counterV0Deployer } = await getNamedAccounts();

  if (hre.network.name !== "hardhat") {
    if (deployer !== counterV0Deployer) {
      console.error(
        `Wrong deployer: ${deployer}\n expected: ${counterV0Deployer}`
      );
      process.exit(1);
    }
    console.log(
      `Deploying CounterV0 to ${hre.network.name}. Hit ctrl + c to abort`
    );
    await sleep(5000);
  }

  const { relayV0 } = getRelayV0Addresses(hre.network.name);

  await deploy("CounterV0", {
    from: deployer,
    proxy: {
      proxyContract: "EIP173ProxyWithReceive",
    },
    args: [relayV0],
    log: true,
  });
};

func.skip = async (hre: HardhatRuntimeEnvironment) => {
  return hre.network.name !== "hardhat";
};
func.tags = ["CounterV0"];

export default func;
