// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {
    RelayerContextERC2771
} from "@gelatonetwork/relayer-context/contracts/RelayerContextERC2771.sol";

contract Counter is RelayerContextERC2771 {
    uint256 public counter;
    mapping(address => uint256) public contextCounter;

    event IncrementCounter();
    event IncrementContextCounter(address _msgSender);

    //solhint-disable-next-line no-empty-blocks
    constructor(address relayer) RelayerContextERC2771(relayer) {}

    function increment() external onlyRelayer {
        // payment
        _uncheckedTransferToFeeCollectorUncapped();

        // logic
        counter += 1;
        emit IncrementCounter();
    }

    function incrementContext() external onlyRelayer {
        address _msgSender = _msgSender();

        // logic
        contextCounter[_msgSender] += 1;
        emit IncrementContextCounter(_msgSender);
    }

    function currentCounter() external view returns (uint256) {
        return counter;
    }

    function currentContextCounter(address _msgSender)
        external
        view
        returns (uint256)
    {
        return contextCounter[_msgSender];
    }
}
