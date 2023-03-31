// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Boomerang {
    struct BoomerangInfo {
        uint256 expiryTime;
        uint256 updateFrequency;
        address creator;
        bool locked;
    }

    mapping(uint256 => BoomerangInfo) public boomerangs;
    uint256 public totalBoomerangs;

    event BoomerangCreated(uint256 indexed id, uint256 expiryTime, uint256 updateFrequency, address creator);
    event BoomerangCheckedIn(uint256 indexed id, address creator);

    function createBoomerang(uint256 expiryTime, uint256 updateFrequency) external {
        require(expiryTime > block.timestamp, "Expiry time must be in the future");
        boomerangs[totalBoomerangs] = BoomerangInfo(expiryTime, updateFrequency, msg.sender, true);
        emit BoomerangCreated(totalBoomerangs, expiryTime, updateFrequency, msg.sender);
        totalBoomerangs++;
    }

    function checkIn(uint256 id) external {
        BoomerangInfo storage boomerang = boomerangs[id];
        require(msg.sender == boomerang.creator, "Only the creator can check in a Boomerang");
        require(block.timestamp < boomerang.expiryTime, "Boomerang has expired");
        require(boomerang.locked, "Boomerang is already unlocked");

        boomerang.locked = true;
        emit BoomerangCheckedIn(id, msg.sender);
    }

    function isExpired(uint256 id) external view returns (bool) {
        return block.timestamp >= boomerangs[id].expiryTime;
    }
}
