// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract BananaSplit {
    struct User {
        bytes32 eHash;
        address addr;
        bool exists;
    }
    
    mapping(bytes32 => User) public usersByHash;    // eHash -> User
    mapping(address => bytes32) public usersByAddr;  // address -> eHash
    
    event UserRegistered(bytes32 indexed eHash, address indexed addr);
    
    function registerUser(bytes32 eHash, address addr) external {
        require(!usersByHash[eHash].exists, "Hash already registered");
        require(usersByAddr[addr] == bytes32(0), "Address already registered");
        
        usersByHash[eHash] = User({
            eHash: eHash,
            addr: addr,
            exists: true
        });
        usersByAddr[addr] = eHash;
        
        emit UserRegistered(eHash, addr);
    }

    function verifySignature(
        bytes32 eHash,
        bytes32 message,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) external view returns (bool) {
        require(usersByHash[eHash].exists, "User not registered");
        
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(message);
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, v, r, s);
        
        return recoveredSigner == usersByHash[eHash].addr;
    }
}
