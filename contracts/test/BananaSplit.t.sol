// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/forge-std/src/Test.sol";
import "../src/BananaSplit.sol";

contract BananaSplitTest is Test {
    BananaSplit public bananaSplit;
    address alice = vm.addr(1);
    bytes32 constant ALICE_HASH = bytes32(uint256(1));
    
    function setUp() public {
        bananaSplit = new BananaSplit();
    }

    function testRegisterUser() public {
        vm.prank(alice);
        bananaSplit.registerUser(ALICE_HASH, alice);
        
        (bytes32 eHash, address addr, bool exists) = bananaSplit.usersByHash(ALICE_HASH);
        assertEq(eHash, ALICE_HASH);
        assertEq(addr, alice);
        assertTrue(exists);
        
        assertEq(bananaSplit.usersByAddr(alice), ALICE_HASH);
    }

    function testCannotRegisterSameHashTwice() public {
        vm.prank(alice);
        bananaSplit.registerUser(ALICE_HASH, alice);
        
        vm.prank(address(0x2));
        vm.expectRevert("Hash already registered");
        bananaSplit.registerUser(ALICE_HASH, address(0x2));
    }

    function testCannotRegisterSameAddressTwice() public {
        vm.prank(alice);
        bananaSplit.registerUser(ALICE_HASH, alice);
        
        vm.prank(alice);
        vm.expectRevert("Address already registered");
        bananaSplit.registerUser(bytes32(uint256(2)), alice);
    }

    function testVerifySignature() public {
        // Use the address that corresponds to private key 1
        address signer = vm.addr(1);  // Get the actual address for private key 1
        
        // Register the correct signer
        vm.prank(signer);
        bananaSplit.registerUser(ALICE_HASH, signer);

        // Create a message and sign it with private key 1
        string memory rawMessage = "Hello World";
        bytes32 message = keccak256(bytes(rawMessage));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(message);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, ethSignedMessageHash);

        // Debugging: Log intermediate values
        emit log_bytes32(message);
        emit log_bytes32(ethSignedMessageHash);
        emit log_address(signer);  // Log the actual signer address
        emit log_uint(v);
        emit log_bytes32(r);
        emit log_bytes32(s);

        bool isValid = bananaSplit.verifySignature(ALICE_HASH, message, r, s, v);
        assertTrue(isValid);
    }

    function testVerifySignatureWithWrongSigner() public {
        address signer = vm.addr(1);
        
        vm.prank(signer);
        bananaSplit.registerUser(ALICE_HASH, signer);

        // Create a message and sign it with Bob's private key
        bytes32 message = keccak256("Hello World");
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(message);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(2, ethSignedMessageHash); // Private key 2 corresponds to bob

        bool isValid = bananaSplit.verifySignature(ALICE_HASH, message, r, s, v);
        assertFalse(isValid);
    }

    function testVerifySignatureUnregisteredUser() public {
        bytes32 message = keccak256("Hello World");
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(message);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, ethSignedMessageHash);

        vm.expectRevert("User not registered");
        bananaSplit.verifySignature(ALICE_HASH, message, r, s, v);
    }
}
