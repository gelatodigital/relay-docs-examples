// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {
    ERC2771Context
} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

// Inheriting ERC2771Context gives access to:
// 1. isTrustedForwarder(), returns true if the address is the trustedForwarder
// 2. _msgSender() - function to retrieve original off-chain sender by
// taking last 20 bytes of calldata.
contract CounterERC2771 is ERC2771Context {
    // A mapping of a counter to each _msgSender()
    mapping(address => uint256) public contextCounter;

    event IncrementContextCounter(address _msgSender);

    // a modifier which utilises `isTrustedForwarder` for security.
    modifier onlyTrustedForwarder() {
        require(
            isTrustedForwarder(msg.sender),
            "Only callable by Trusted Forwarder"
        );
        _;
    }

    // Setting the trustedForwarder upon contract deployment
    //solhint-disable-next-line no-empty-blocks
    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    // `incrementContext` is the target function to call
    // this function increments the counter mapped to the _msgSender
    function incrementContext() external onlyTrustedForwarder {
        address _msgSender = _msgSender();

        contextCounter[_msgSender]++;

        // Emitting an event for testing purposes
        emit IncrementContextCounter(_msgSender);
    }
}
