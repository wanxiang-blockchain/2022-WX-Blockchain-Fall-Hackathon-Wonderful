// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./interfaces/IConfig.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Config is IConfig {
    string userMetadataBaseUri;
    string worshipMetadataBaseUri;

    function getUserMetadataUri(address _id) external override view returns (string memory) {
        return string(abi.encodePacked(userMetadataBaseUri, Strings.toString(uint160(_id))));
    }

    function getWorshipMetadataUri(bytes16 _id) external override view returns (string memory) {
        return string(abi.encodePacked(userMetadataBaseUri, Strings.toString(uint128(_id))));
    }

    function setUserMetadataBaseUri(string calldata _uri) external {
        userMetadataBaseUri = _uri;
    }

    function setWorshipMetadataBaseUri(string calldata _uri) external {
        worshipMetadataBaseUri = _uri;
    }
}