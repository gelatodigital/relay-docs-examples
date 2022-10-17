import { BigNumberish, BytesLike } from "ethers";

export interface SyncFeeRequest {
  chainId: BigNumberish;
  target: string;
  data: BytesLike;
  feeToken: string;
}

export interface RelayResponse {
  taskId: string;
}
