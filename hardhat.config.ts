import { HardhatUserConfig } from "hardhat/config";

// PLUGINS
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";

// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const WALLET_DEPLOYER_PK = process.env.WALLET_DEPLOYER_PK;
const ALCHEMY_ID = process.env.ALCHEMY_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  // hardhat-deploy
  namedAccounts: {
    deployer: {
      default: 0,
    },
    counterDeployer: {
      default: "0xa0B2F93e4ef04de51a91bcBc494c04E55F8ff6EB",
    },
    walletDeployer: {
      default: "0xD212b936929E0AE6510757Ef8C5c23FF2BAc3112",
    },
  },

  networks: {
    hardhat: {
      forking: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
        blockNumber: 32805031, // 07.09.22
      },
    },
    alfajores: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 44787,
      url: "https://alfajores-forno.celo-testnet.org",
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
    },
    bsc: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 56,
      url: "https://bsc-dataseed1.ninicoin.io/",
    },
    ethereum: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ID}`,
    },
    evmos: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 9001,
      url: "https://eth.bd.evmos.org:8545",
    },
    rinkeby: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 4,
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_ID}`,
    },
    gnosis: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 100,
      url: `https://rpc.gnosischain.com/`,
    },
    goerli: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 5,
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_ID}`,
    },
    arbitrumGoerli: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 421613,
      url: `https://arb-goerli.g.alchemy.com/v2/${ALCHEMY_ID}`,
    },
    kovan: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 42,
      url: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_ID}`,
    },
    polygon: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 137,
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
    },
    mumbai: {
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`,
    },
    moonbeam: {
      url: "https://moonbeam.api.onfinality.io/public",
      chainId: 1284,
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
    },
    moonbeamAlpha: {
      url: "https://moonbeam-alpha.api.onfinality.io/public",
      chainId: 1287,
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
    },
    moonriver: {
      url: "https://moonriver-rpc.dwellir.com",
      chainId: 1285,
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
    },
    optimisticGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_ID}`,
      chainId: 420,
      accounts: WALLET_DEPLOYER_PK ? [WALLET_DEPLOYER_PK] : [],
    },
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY ? ETHERSCAN_API_KEY : "",
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.16",
        settings: {
          optimizer: { enabled: true, runs: 999999 },
        },
      },
    ],
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
