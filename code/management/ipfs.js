const process = require('process')
const minimist = require('minimist');
const dotenv = require('dotenv');
const { Web3Storage, getFilesFromPath } = require('web3.storage');

dotenv.config();

async function main () {
  const args = minimist(process.argv.slice(2))
  const token = process.env.IPFS_TOKEN;

  if (!token) {
    return console.error('A token is needed. You can create one on https://web3.storage')
  }

  if (args._.length < 1) {
    return console.error('Please supply the path to a file or directory')
  }

  const storage = new Web3Storage({ token })
  const files = []

  for (const path of args._) {
    const pathFiles = await getFilesFromPath(path)
    files.push(...pathFiles)
  }

  console.log(`Uploading ${files.length} files`)
  const cid = await storage.put(files)
  console.log('Content added with CID:', cid)
}

main()