// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract Counter is ERC2771Context {
    mapping(address => uint256) public counter;

    event IncrementCounter(uint256 indexed by);

    //solhint-disable-next-line no-empty-blocks
    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    function incrementCounter(uint256 _by) external {
        require(
            isTrustedForwarder(msg.sender),
            "Counter: Only callable by Gelato Relay!"
        );
        counter[_msgSender()] += _by;
        emit IncrementCounter(_by);
    }

    function current() external view returns (uint256) {
        return counter[_msgSender()];
    }
}
