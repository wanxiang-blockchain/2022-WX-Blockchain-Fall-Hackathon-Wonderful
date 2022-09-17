const Config = artifacts.require("Config");
const UserManager = artifacts.require("UserManager");
const WorshipManager = artifacts.require("WorshipManager");

module.exports = async function (deployer) {
  await deployer.deploy(Config);
  await deployer.deploy(UserManager);
  await deployer.deploy(WorshipManager);

  let config = await Config.deployed();
  let userMgr = await UserManager.deployed();
  let worshipMgr = await WorshipManager.deployed();

  await config.setUserMetadataBaseUri("https://wanxiang-fall.oss-cn-hangzhou.aliyuncs.com/");
  await config.setWorshipMetadataBaseUri("https://wanxiang-fall.oss-cn-hangzhou.aliyuncs.com/");
  
  await userMgr.setConfigContractAddress(config.address);
  await userMgr.setWorshipManagerAddress(worshipMgr.address);

  await worshipMgr.setConfigContractAddress(config.address);
  await worshipMgr.setUserManagerContractAddress(userMgr.address);
};
