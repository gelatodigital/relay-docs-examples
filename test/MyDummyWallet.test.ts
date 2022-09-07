import hre, { ethers, deployments } from "hardhat";
import {
  setBalance,
  impersonateAccount,
} from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { MockERC20, MyDummyWallet } from "../typechain";

import { getGelatoAddress } from "@gelatonetwork/relay-context";
import {
  GELATO_RELAY_ADDRESS,
  GELATO_RELAY_ABI,
  INIT_BALANCE,
  FEE,
  VITALIK,
  AMOUNT_TO_SEND,
} from "./constants";
import { Contract, Signer } from "ethers";

const HARDHAT_FORK = "polygon";
const gelato = getGelatoAddress(HARDHAT_FORK);

const TASK_ID = ethers.utils.keccak256("0xdeadbeef");

describe("Test MyDummyWallet Smart Contract", function () {
  let gelatoSigner: Signer;

  let mockERC20: MockERC20;
  let myDummyWallet: MyDummyWallet;
  let gelatoRelay: Contract;

  let target: string;
  let feeToken: string;

  beforeEach(async function () {
    if (hre.network.name !== "hardhat") {
      console.error("Test Suite is meant to be run on hardhat only");
      process.exit(1);
    }

    await deployments.fixture();

    // impersonate Gelato Diamond and fund it
    await impersonateAccount(gelato);
    gelatoSigner = await ethers.getSigner(gelato);
    await setBalance(await gelatoSigner.getAddress(), INIT_BALANCE);

    // connect to Gelato Relay via Gelato Diamond
    gelatoRelay = await new ethers.Contract(
      GELATO_RELAY_ADDRESS,
      GELATO_RELAY_ABI,
      gelatoSigner
    );

    myDummyWallet = await hre.ethers.getContract("MyDummyWallet");
    mockERC20 = await hre.ethers.getContract("MockERC20");

    target = myDummyWallet.address;
    feeToken = mockERC20.address;

    // top up target address with mock ERC20 balance
    await mockERC20.transfer(target, INIT_BALANCE);
  });

  it("#0: MyDummyWallet has an initial MockERC20 balance", async () => {
    expect(await mockERC20.balanceOf(target)).to.equal(INIT_BALANCE);
  });

  it("#1: MyDummyWallet.sendToFriend can only be called by relayer", async () => {
    await expect(
      myDummyWallet.sendToFriend(feeToken, VITALIK, AMOUNT_TO_SEND)
    ).to.be.revertedWith("GelatoRelayContext.onlyGelatoRelay");
  });

  it("#2: MyDummyWallet.sendToFriend via GelatoRelay transfers ERC20 tokens and pays fee", async () => {
    const data = myDummyWallet.interface.encodeFunctionData("sendToFriend", [
      feeToken,
      VITALIK,
      AMOUNT_TO_SEND,
    ]);

    await expect(
      gelatoRelay.callWithSyncFee(target, data, feeToken, FEE, TASK_ID)
    )
      .to.emit(gelatoRelay, "LogCallWithSyncFee")
      .and.to.emit(myDummyWallet, "LogSendToFriend")
      .withArgs(VITALIK, AMOUNT_TO_SEND);

    // expect transfer to give Vitalik the required balance
    expect(await mockERC20.balanceOf(VITALIK)).to.equal(AMOUNT_TO_SEND);

    // expect Gelato Diamond to recieve fee from target contract
    expect(await mockERC20.balanceOf(gelato)).to.equal(FEE);
  });
});
