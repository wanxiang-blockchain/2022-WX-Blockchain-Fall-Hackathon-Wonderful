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
    const contractRawData = fs.readFileSync(config.get("worshipManagerAbiPath"));
    const contractAbi = JSON.parse(contractRawData).abi;

    web3 = new Web3(config.get('nodeAddress'));
    web3.eth.handleRevert = true;
    contract = new web3.eth.Contract(contractAbi, config.get('worshipManagerContractAddress'));

    let privateKeysStr = fs.readFileSync(".secret").toString();
    privateKeys = JSON.parse(privateKeysStr);
}

async function createWorship(privateKey) {
  let ret = await ethereum.sendTransaction(web3, config.get('chainId'), contract, 'createWorship', privateKey, []);
  console.log('WorshipCreated', ret.logs[0].args);
}

async function applyJoin(privateKey, id) {
  await ethereum.sendTransaction(web3, config.get('chainId'), contract, 'applyJoin', privateKey, [id]);
}

async function acceptApplication(privateKey, id, userId) {
  await ethereum.sendTransaction(web3, config.get('chainId'), contract, 'acceptApplication', privateKey, [id, userId]);
}

async function getWorshipInfo(id) {
  let ret = await ethereum.contractCall(contract, 'getWorshipInfo', [id]);
  console.log('ret', ret);
}

(async function () {
  function list(val) {
    return val.split(',')
  }

  program
      .version('0.1.0')
      .option('-c, --create <key index>', 'Create a new worship group', list)
      .option('-j, --join <key index>,<worship id>', 'Apply to join a worship group', list)
      .option('-a, --accept <key index>,<worship id>,<user id>', 'Accept an application', list)
      .option('-w, --worship <worship id>', 'Get worship information', list)
      .parse(process.argv);

  if (program.opts().create) {
      if (program.opts().create.length != 1) {
          console.log('1 argument are needed, but ' + program.opts().create.length + ' provided');
          return;
      }
      
      init();
      await createWorship(privateKeys[program.opts().create[0]]);
  }
  else if (program.opts().join) {
    if (program.opts().join.length != 2) {
        console.log('2 arguments are needed, but ' + program.opts().join.length + ' provided');
        return;
    }

    init();
    await applyJoin(privateKeys[program.opts().join[0]], program.opts().join[1]);
  }
  else if (program.opts().accept) {
    let accept = program.opts().accept;
    if (accept.length != 3) {
        console.log('3 arguments are needed, but ' + accept.length + ' provided');
        return;
    }

    init();
    await acceptApplication(privateKeys[accept[0]], accept[1], accept[2]);
  }
  else if (program.opts().worship) {
    let worship = program.opts().worship;
    if (worship.length != 1) {
        console.log('1 arguments are needed, but ' + worship.length + ' provided');
        return;
    }

    init();
    await getWorshipInfo(worship[0]);
  }
}());