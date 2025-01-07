// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../lib/forge-std/src/Test.sol";
import "../src/BananaSplit.sol";

contract BananaSplitTest is Test {
    BananaSplit public bananaSplit;
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        bananaSplit = new BananaSplit();
    }

    function testCollectBanana() public {
        vm.prank(alice);
        bananaSplit.collectBanana(bob);
        
        assertEq(bananaSplit.getBananaCount(alice), 1);
        assertTrue(bananaSplit.connections(alice, bob));
    }

    function testCannotCollectTwice() public {
        vm.prank(alice);
        bananaSplit.collectBanana(bob);
        
        vm.prank(alice);
        vm.expectRevert("Already collected from this address");
        bananaSplit.collectBanana(bob);
    }
}
