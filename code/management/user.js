const Web3 = require('web3');
const fs = require('fs');
const ethereum = require('./ethereum');
const { program } = require('commander');
const config = require('config');

let web3;
let contract;
let privateKeys;

function init() {
    // Load contract abi, and init contract object
    const contractRawData = fs.readFileSync(config.get("userManagerAbiPath"));
    const contractAbi = JSON.parse(contractRawData).abi;

    web3 = new Web3(config.get('nodeAddress'));
    web3.eth.handleRevert = true;
    contract = new web3.eth.Contract(contractAbi, config.get('userManagerContractAddress'));

    let privateKeysStr = fs.readFileSync(".secret").toString();
    privateKeys = JSON.parse(privateKeysStr);
}

async function getUserInfo(userId) {
  let userInfo = await ethereum.contractCall(contract, 'getUserInfo', [userId]);
  console.log(userInfo);
}

(async function () {
  function list(val) {
    return val.split(',')
  }

  program
      .version('0.1.0')
      .option('-q, --query <user address>', 'Accept an application', list)
      .parse(process.argv);

  if (program.opts().query) {
      if (program.opts().query.length != 1) {
          console.log('1 argument are needed, but ' + program.opts().query.length + ' provided');
          return;
      }
      
      init();
      await getUserInfo(program.opts().query[0]);
  }
}());