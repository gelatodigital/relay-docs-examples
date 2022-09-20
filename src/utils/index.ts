export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getDeploymentAddress = (contract: string): string => {
  switch (contract) {
    case "myDummyWallet":
      return "0xA045eb75e78f4988d42c3cd201365bDD5D76D406";
    case "counter":
      return "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27";
    case "counterERC2771":
      return "0x30d97B13e29B0cd42e6ebd48dbD9063465bF1997";
    default:
      throw new Error(`No address for contract: ${contract}`);
  }
};

export const getSupportedChainId = (network: string): number => {
  switch (network) {
    case "goerli":
      return 5;
    case "mumbai":
      return 80001;
    default:
      throw new Error(`No support for chain: ${network}`);
  }
};

export const getEtherscanURL = (network: string): string => {
  switch (network) {
    case "goerli":
      return "https://goerli.etherscan.io/address";
    case "mumbai":
      return "https://mumbai.polygonscan.com/address";
    default:
      throw new Error(`No support for chain: ${network}`);
  }
};
