import { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { sleep } from "../src/utils";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer, walletDeployer } = await getNamedAccounts();

  if (hre.network.name !== "hardhat") {
    if (deployer !== walletDeployer) {
      console.error(
        `Wrong deployer: ${deployer}\n expected: ${walletDeployer}`
      );
      process.exit(1);
    }
    console.log(
      `Deploying MyDummyWallet to ${hre.network.name}. Hit ctrl + c to abort`
    );
    await sleep(5000);
  }

  await deploy("MyDummyWallet", {
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

func.tags = ["MyDummyWallet"];

export default func;
