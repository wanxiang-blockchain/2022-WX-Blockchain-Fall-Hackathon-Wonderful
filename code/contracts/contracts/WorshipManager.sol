// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./interfaces/IConfig.sol";
import "./UserManager.sol";

enum Role {
    None,
    Admin,
    Manager,
    Member
}

struct Member {
    address id;
    Role role;
}

struct Worship {
    bytes16 id;
    address[] members;
    mapping(address => Member) memberMap;
    address[] applicants;
}

struct WorshipInfo {
    bytes16 id;
    Member[] members;
    address[] applicants;
}

contract WorshipManager {
    uint8 constant RETRY_TIMES = 10;

    // all worships
    mapping(bytes16 => Worship) public worships;
    // total worship number
    uint128 public worshipNumber;
    // config contract
    IConfig public configContract;
    // user manager contract
    UserManager public userManagerContract;

    event WorshipCreated(address indexed creator, bytes16 id);

    /**
     * @dev Creates a worship group
     */
    function createWorship() external {
        bool found = false;
        for (uint8 i = 0; i < RETRY_TIMES; i++) {
            bytes32 hash = keccak256(abi.encode(block.number, msg.sender, i));
            bytes16 worshipAddr = bytes16(hash);
            Worship storage ws = worships[worshipAddr];
            if (ws.id == bytes16(0)) {
                ws.id = worshipAddr;
                ws.members.push(msg.sender);
                Member storage m = ws.memberMap[msg.sender];
                m.id = msg.sender;
                m.role = Role.Admin;
                found = true;
                userManagerContract.joinWorship(worshipAddr, msg.sender);
                emit WorshipCreated(msg.sender, ws.id);
                break;
            }
        }

        require(found, "Create worship failed");
    }

    /**
     * @dev Returns the uri of the metadata
     */
    function getMetadataUri(bytes16 _id) external view returns (string memory) {
        return configContract.getWorshipMetadataUri(_id);
    }

    /**
     * @dev Applys to join the worship group
     * @param _id: the id of worship group
     */
    function applyJoin(bytes16 _id) external {
        Worship storage ws = worships[_id];
        require(ws.id != bytes16(0), "Worship not exists");

        require(ws.memberMap[msg.sender].id != msg.sender, "Member can not apply");

        for (uint256 i = 0; i < ws.applicants.length; i++) {
            require(ws.applicants[i] != msg.sender, "Duplicated application");
        }

        ws.applicants.push(msg.sender);
    }

    /**
     * @dev Accepts the application
     * @param _id: the id of worship group
     * @param _userId: the id of applicant
     */
    function acceptApplication(bytes16 _id, address _userId) external {
        Worship storage ws = worships[_id];
        require(ws.id != bytes16(0), "Worship not exists");

        require(ws.memberMap[msg.sender].role == Role.Admin, "Permission denied");

        bool found = false;
        for (uint256 i = 0; i < ws.applicants.length; i++) {
            if (ws.applicants[i] == _userId) {
                found = true;
                ws.applicants[i] = ws.applicants[ws.applicants.length - 1];
                ws.applicants.pop();
                ws.members.push(_userId);
                Member storage m = ws.memberMap[_userId];
                m.id = _userId;
                m.role = Role.Member;
                userManagerContract.joinWorship(_id, _userId);
                break;
            }
        }

        require(found, "Applicant not exists");
    }

    /**
     * @dev Quits a worship group
     * @param _id: the id of worship group
     */
    function quitWorship(bytes16 _id) external {
        Worship storage ws = worships[_id];
        require(ws.id != bytes16(0), "Worship not exists");

        Member storage member = ws.memberMap[msg.sender];
        require(member.id == msg.sender, "Not a member");
        require(member.role == Role.Member, "Only role member can quit");

        userManagerContract.quitWorship(_id, msg.sender);

        delete ws.memberMap[msg.sender];
        for (uint256 i = 0; i < ws.members.length; i++) {
            if (ws.members[i] == msg.sender) {
                ws.members[i] = ws.members[ws.members.length - 1];
                ws.members.pop();
                break;
            }
        }
    }

    function setConfigContractAddress(address _address) external {
        configContract = IConfig(_address);
    }

    function setUserManagerContractAddress(address _address) external {
        userManagerContract = UserManager(_address);
    }

    function getWorshipInfo(bytes16 _id) external view returns (WorshipInfo memory ret) {
        Worship storage ws = worships[_id];
        require(ws.id != bytes16(0), "Worship not exists");

        ret.id = ws.id;
        ret.applicants = ws.applicants;
        ret.members = new Member[](ws.members.length);
        for (uint256 i = 0; i < ws.members.length; i++) {
            ret.members[i] = ws.memberMap[ws.members[i]];
        }
    }
}
