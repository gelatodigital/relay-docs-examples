// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {
    RelayerContextERC2771
} from "@gelatonetwork/relayer-context/contracts/RelayerContextERC2771.sol";

contract Counter is RelayerContextERC2771 {
    mapping(address => uint256) public counter;

    event IncrementCounter(uint256 indexed by);

    //solhint-disable-next-line no-empty-blocks
    constructor(address relayer) RelayerContextERC2771(relayer) {}

    //solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    function incrementCounter(uint256 _by) external onlyRelayer {
        counter[_msgSender()] += _by;
        emit IncrementCounter(_by);
        _uncheckedTransferToFeeCollectorUncapped();
    }

    function current() external view returns (uint256) {
        return counter[_msgSender()];
    }
}
