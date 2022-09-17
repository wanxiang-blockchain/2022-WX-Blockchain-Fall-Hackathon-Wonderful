# Management
It is the user interface for users to manage all worships and members.

## Install
```
npm install
```

## Prerequisites
- npm: >= 6.14.16
- node: >= 14.19.1

## Configuration
### .env
```
IPFS_TOKEN=xxx
```

It is the access token of web3 storage.

### .secret
```
[
    "8d17969fd442d82868f9f256ce12338bc41fca6xxxxxxxxxxxxxxxxxxxxxxxxx",
    "358401c43d5099d8bd94ebca1cfd42b0f300d59xxxxxxxxxxxxxxxxxxxxxxxxx"
]
```

Config all the private keys of members in the `.secret` file.

## Usage
### Worship
#### Create a worship group
```
node worship.js -c <PK_INDEX>
```

`<PK_INDEX>` is the index of the private key in the `.secret` file. For example, if you set `<PK_INDEX>` to 0, namely you will use the first private key to create a worship group.

#### Join a worship group
```
node worship.js -j <PK_INEX>,<WORSHIP_ID>
```
`<WORSHIP_ID>` is the id the a worship.

#### Accept an application
```
node worship.js -a <PK_INDEX>,<WORSHIP_ID>,<APPLICANT_ID>
```
`<APPLICANT_ID>` is the id of the applicant

#### Query the information of a worship group
```
node worship.js -w <WORSHIP_ID>
```