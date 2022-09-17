// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IConfig {
    function getUserMetadataUri(address _id) external view returns (string memory);
    function getWorshipMetadataUri(bytes16 _id) external view returns (string memory);
}