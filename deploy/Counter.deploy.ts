import { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  if (hre.network.name !== "hardhat") {
    console.log(`Deploying Counter to ${hre.network.name}.`);
  }

  const relayAddress = "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92";

  await deploy("Counter", {
    from: deployer,
    args: [relayAddress],
    log: true,
  });
};

// func.skip = async (hre: HardhatRuntimeEnvironment) => {
//   return hre.network.name !== "hardhat";
// };

func.tags = ["Counter"];

export default func;
