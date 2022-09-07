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
      `Deploying Counter to ${hre.network.name}. Hit ctrl + c to abort`
    );
    await sleep(5000);
  }

  await deploy("Counter", {
    from: deployer,
    proxy: {
      proxyContract: "EIP173ProxyWithReceive",
    },
    log: true,
  });
};

func.skip = async (hre: HardhatRuntimeEnvironment) => {
  return hre.network.name !== "hardhat";
};

func.tags = ["Counter"];

export default func;
