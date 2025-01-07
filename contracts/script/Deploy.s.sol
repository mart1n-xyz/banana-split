// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../lib/forge-std/src/Script.sol";
import "../src/BananaSplit.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        new BananaSplit();
        vm.stopBroadcast();
    }
}