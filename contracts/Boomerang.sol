// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Boomerang {
    struct BoomerangInfo {
        uint256 expiryTime;
        uint256 updateFrequency;
        uint256 lastCheckInTime;
        address creator;
    }

    mapping(uint256 => BoomerangInfo) public boomerangs;
    uint256 public totalBoomerangs;

    event BoomerangCreated(uint256 indexed id, uint256 expiryTime, uint256 updateFrequency, address creator);
    event BoomerangCheckedIn(uint256 indexed id, address creator);

    function createBoomerang(uint256 expiryTime, uint256 updateFrequency) external {
        require(expiryTime > block.timestamp, "Expiry time must be in the future");
        boomerangs[totalBoomerangs] = BoomerangInfo(expiryTime, updateFrequency, block.timestamp, msg.sender);
        emit BoomerangCreated(totalBoomerangs, expiryTime, updateFrequency, msg.sender);
        totalBoomerangs++;
    }

    function checkIn(uint256 id) external {
        BoomerangInfo storage boomerang = boomerangs[id];
        require(msg.sender == boomerang.creator, "Only the creator can check in a Boomerang");
        require(checkIfUnlocked(id) == false, "Boomerang is unlocked or expired");

        boomerang.lastCheckInTime = block.timestamp;
        emit BoomerangCheckedIn(id, msg.sender);
    }

    function isExpired(uint256 id) external view returns (bool) {
        return checkIfExpired(id);
    }

    function isUnlocked(uint256 id) external view returns (bool) {
        return checkIfUnlocked(id) || checkIfExpired(id);
    }

    function checkIfUnlocked(uint256 id) internal view returns (bool) {
        BoomerangInfo storage boomerang = boomerangs[id];
        return (block.timestamp - boomerang.lastCheckInTime) > boomerang.updateFrequency;
    }

    function checkIfExpired(uint256 id) internal view returns (bool) {
        BoomerangInfo storage boomerang = boomerangs[id];
        return block.timestamp > boomerang.expiryTime;
    }

    function getTotalBoomerangs() external view returns (uint256) {
        return totalBoomerangs;
    }

    function getBoomerangInfo(uint256 id) external view returns (uint256, uint256, uint256, address) {
        BoomerangInfo storage boomerang = boomerangs[id];
        return (boomerang.expiryTime, boomerang.updateFrequency, boomerang.lastCheckInTime, boomerang.creator);
    }
    
}
