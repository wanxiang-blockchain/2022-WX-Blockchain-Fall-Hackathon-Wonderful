// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./interfaces/IConfig.sol";

struct UserInfo {
    address id;
    bytes16[] worships;
}

contract UserManager {
    // all users 
    mapping(address => UserInfo) internal users;
    // config contract
    IConfig public configContract;
    // the address of worship manager
    address public worshipMgr;

    /**
     * @dev Returns the uri of a user
     */
    function getMetadataUri(address _id) external view returns (string memory) {
        return configContract.getUserMetadataUri(_id);
    }

    /**
     * @dev Joins a worship group
     */
    function joinWorship(bytes16 _id, address _userId) external {
        require(msg.sender == worshipMgr, "Not worship manager");

        UserInfo storage u = users[_userId];
        u.id = _userId;
        u.worships.push(_id);
    }

    /**
     * @dev Quits a worship group
     */
    function quitWorship(bytes16 _id, address _userId) external {
        require(msg.sender == worshipMgr, "Not worship manager");

        UserInfo storage u = users[_userId];
        
        bool found = false;
        for (uint256 i = 0; i < u.worships.length; i++) {
            if (u.worships[i] == _id) {
                u.worships[i] = u.worships[u.worships.length - 1];
                u.worships.pop();
                found = true;
                break;
            }
        }
        require(found, "Quit failed");
    }

    function setConfigContractAddress(address _address) external {
        configContract = IConfig(_address);
    }

    function setWorshipManagerAddress(address _address) external {
        worshipMgr = _address;
    }

    function getUserInfo(address _address) public view returns (UserInfo memory) {
        return users[_address];
    }
}
