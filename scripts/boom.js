const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi } = require('../build/contracts/Boomerang.json');

require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const PROVIDER_URL = `http://127.0.0.1:8545`;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: MNEMONIC,
  },
  providerOrUrl: PROVIDER_URL,
});

const web3 = new Web3(provider);
const boomerangContract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

const createBoomerang = async (expiryTime, updateFrequency) => {
  const accounts = await web3.eth.getAccounts();
  const creator = accounts[0];

  console.log(`Creating boomerang for account ${creator}`);

  const result = await boomerangContract.methods.createBoomerang(expiryTime, updateFrequency).send({
    from: creator,
    gas: 3000000,
    gasPrice: web3.utils.toWei('50', 'gwei'),
  });

  const event = result.events.BoomerangCreated;
    if (event) {
    console.log(`Boomerang created with ID: ${event.returnValues.id} for contract ${CONTRACT_ADDRESS}`);
    } else {
    console.log(`Transaction receipt does not contain BoomerangCreated event.`);
    }

//   console.log(`Boomerang created with ID: ${result.events.BoomerangCreated.returnValues.id}`);
};

(async function () {
  const now = Math.floor(Date.now() / 1000);
  const dayInSeconds = 24 * 60 * 60;

  await createBoomerang(now + dayInSeconds * 30, dayInSeconds * 7);
  await createBoomerang(now + dayInSeconds * 60, dayInSeconds * 14);

  provider.engine.stop();
})();
