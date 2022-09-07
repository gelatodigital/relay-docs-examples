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

// use the helper function: getGelatoAddress
// to retreive the Gelato Diamond address on your forked network
// for impersonation
const HARDHAT_FORK = "polygon";
const gelato = getGelatoAddress(HARDHAT_FORK);

const TASK_ID = ethers.utils.keccak256("0xdeadbeef");

describe("Test MyDummyWallet Smart Contract", function () {
  // the Gelato Diamond always calls the Relay contract, so
  // this signer will be impersonating the Gelato Diamond
  let gelatoSigner: Signer;

  // deploying a mock ERC-20 token for testing purposes
  let mockERC20: MockERC20;
  let myDummyWallet: MyDummyWallet;

  // connecting to the GelatoRelay contract on the local forked network
  let gelatoRelay: Contract;

  // the target address, and what feeToken to pay in
  let target: string;
  let feeToken: string;

  beforeEach(async function () {
    if (hre.network.name !== "hardhat") {
      console.error("Test Suite is meant to be run on hardhat only");
      process.exit(1);
    }

    // deploy all contracts locally using deploy scripts in deploy/
    await deployments.fixture();

    // impersonate Gelato Diamond and fund it
    await impersonateAccount(gelato);
    gelatoSigner = await ethers.getSigner(gelato);
    await setBalance(
      await gelatoSigner.getAddress(),
      ethers.utils.parseEther("1")
    );

    // connect to Gelato Relay via Gelato Diamond
    gelatoRelay = await new ethers.Contract(
      GELATO_RELAY_ADDRESS,
      GELATO_RELAY_ABI,
      gelatoSigner
    );

    // connect to target MyDummyWallet and feeToken contract
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
    // encode the payload to send to callWithSyncFee on GelatoRelay
    const data = myDummyWallet.interface.encodeFunctionData("sendToFriend", [
      feeToken,
      VITALIK,
      AMOUNT_TO_SEND,
    ]);

    // make sure the forwarded call via GelatoRelay emits an event
    // on GelatoRelay itself and on the target contract
    await expect(
      gelatoRelay.callWithSyncFee(target, data, feeToken, FEE, TASK_ID)
    )
      .and.to.emit(myDummyWallet, "LogSendToFriend")
      .withArgs(VITALIK, AMOUNT_TO_SEND);

    // expect transfer to give Vitalik the required balance
    expect(await mockERC20.balanceOf(VITALIK)).to.equal(AMOUNT_TO_SEND);

    // expect Gelato Diamond to recieve fee from target contract
    expect(await mockERC20.balanceOf(gelato)).to.equal(FEE);
  });
});
