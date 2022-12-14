import { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { sleep } from "../src/utils";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer, counterDeployer } = await getNamedAccounts();

  if (hre.network.name !== "hardhat") {
    if (deployer !== counterDeployer) {
      console.error(
        `Wrong deployer: ${deployer}\n expected: ${counterDeployer}`
      );
      process.exit(1);
    }
    console.log(
      `Deploying CounterERC2771 to ${hre.network.name}. Hit ctrl + c to abort`
    );
    await sleep(5000);
  }
  const relayAddress = "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92";

  await deploy("CounterERC2771", {
    from: deployer,
    proxy: {
      proxyContract: "EIP173ProxyWithReceive",
    },
    args: [relayAddress],
    log: true,
  });
};

func.skip = async (hre: HardhatRuntimeEnvironment) => {
  return hre.network.name !== "hardhat";
};

func.tags = ["Counter"];

export default func;
