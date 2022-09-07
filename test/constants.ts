import { ethers } from "ethers";

export const INIT_BALANCE = ethers.utils.parseUnits("100", 18);
export const AMOUNT_TO_SEND = ethers.utils.parseUnits("0.1", 18);
export const FEE = ethers.utils.parseUnits("0.05", 18);
export const GELATO_RELAY_ADDRESS =
  "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92";

export const VITALIK = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

export const GELATO_RELAY_ABI = [
  "function callWithSyncFee(address _target, bytes _data, address _feeToken, uint256 _fee, bytes32 _taskId)",
  "event LogCallWithSyncFee(address indexed target, address feeToken, uint256 fee, bytes32 taskId)",
];
