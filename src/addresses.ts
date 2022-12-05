/* eslint-disable @typescript-eslint/naming-convention */
export interface relayV0Addresses {
  relayV0: string;
}

export const getRelayV0Addresses = (network: string): relayV0Addresses => {
  switch (network) {
    case "arbitrum":
      return {
        relayV0: "0x0ae392879A228B2484D9B1F80A5D0B7080FE79C2",
      };
    case "avalanche":
      return {
        relayV0: "0xa120a7d4EaF1910D38bc934D756DF507943a4C5a",
      };
    case "bnb":
      return {
        relayV0: "0x43728A95386D64384C76Afd416Dcc8118869BA6c",
      };
    case "cronos":
      return {
        relayV0: "0x62B1a88CCc6BC5e6FF91FB2FCD29Ab4F819b35C6",
      };
    case "ethereum":
      return {
        relayV0: "0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007",
      };
    case "gnosis":
      return {
        relayV0: "0x62B1a88CCc6BC5e6FF91FB2FCD29Ab4F819b35C6",
      };
    case "fantom":
      return {
        relayV0: "0xFbf1CA2be769b79BE01e48F509107dcACb9ae11b",
      };
    case "fuji":
      return {
        relayV0: "0xEF68d6F0CCB444e1Dd2f1b076aFB54a9D7499b23",
      };
    case "goerli":
      return {
        relayV0: "0xf6d4f65325b258b2d70797CA7576CF8CD03Ed7b8",
      };
    case "arbitrumGoerli":
      return {
        relayV0: "0x8cFAcF1d7f052faA1aED6e793f0C451b5dEA8c1E",
      };
    case "polygon":
      return {
        relayV0: "0xE2Fc8F14B6cEb1AD8165623E02953eDB100288bE",
      };
    case "mumbai":
      return {
        relayV0: "0x24D677f8A59A486BfC6d87E9453C4f1fEfcB0958",
      };
    case "moonriver":
      return {
        relayV0: "0xb34758F24fFEf132dc5831C2Cd9A0a5e120CD564",
      };
    case "moonbeam":
      return {
        relayV0: "0x36225733276425f5DbA88977Aef45f042BACB953",
      };
    case "optimisticGoerli":
      return {
        relayV0: "0xaB0A8DCb1590C4565C35cC785dc25A0590398054",
      };
    case "optimism":
      return {
        relayV0: "0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78",
      };
    default:
      throw new Error(`No addresses for Network: ${network}`);
  }
};
