# Metaworship core contracts
All worship basic information is stored on-chain, including the worship DAO.

## Deployment
Because of Rinkeby network is not well supported by Truffle, mainly for the developers in Chana, so the recommended way to deploy contracts is using Remix & Metamask.

## Initialization
### Config.sol
`setUserMetadataBaseUri` and `setWorshipMetadataBaseUri` of `Config.sol` must be called to register the base uri of the metadata of users and worships.

### UserManager.sol
`setConfigContractAddress` must be called to bind the `Config` contract.
`setWorshipManagerAddress` must be called to bind the `WorshipManager` contract.

### WorshipManager.sol
`setConfigContractAddress` must be called to bind the `Config` contract.
`setUserManagerContractAddress` must be called to bind the `UserManager` contract.