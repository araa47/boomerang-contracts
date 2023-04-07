const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('../build/contracts/Boomerang.json');
require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
console.log(MNEMONIC)
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const PROVIDER_URL = `http://127.0.0.1:8545`;

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: MNEMONIC,
  },
  providerOrUrl: PROVIDER_URL,
});

const web3 = new Web3(provider);

(async function() {
  const accounts = await web3.eth.getAccounts();
  console.log(`Connected to network using account: ${provider.addressIndex}`);
  console.log(`Account list: ${accounts}`);

  console.log(`Deploying contract using account: ${accounts[0]}`);

  const boomerang = new web3.eth.Contract(abi);

  const result = await boomerang
    .deploy({
      data: bytecode,
    })
    .send({
      from: accounts[0],
      gas: 3000000,
      gasPrice: web3.utils.toWei('50', 'gwei'),
    });

  console.log(`Contract deployed at address: ${result.options.address}`);

  provider.engine.stop();
})();
