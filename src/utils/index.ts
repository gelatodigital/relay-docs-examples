export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getDeploymentAddress = (contract: string): string => {
  switch (contract) {
    case "MyDummyWallet":
      return "0xA045eb75e78f4988d42c3cd201365bDD5D76D406";
    case "CounterFeeCollector":
      return "0x3ED86D39F5166c574484FB94a1a6337b53660171";
    case "CounterRelayContext":
      return "0x730615186326cF8f03E34a2B49ed0f43A38c0603";
    case "CounterERC2771":
      return "0x30d97B13e29B0cd42e6ebd48dbD9063465bF1997";
    default:
      throw new Error(`No address for contract: ${contract}`);
  }
};
