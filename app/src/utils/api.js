import { ethers } from 'ethers';

// Load the ABI and contract address from the compiled JSON artifact
import Boomerang from '../build/contracts/Boomerang.json';

// Load the provider URL from an environment variable
const providerUrl = process.env.REACT_APP_PROVIDER_URL;

// Create an instance of the provider
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

// Create an instance of the contract
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, Boomerang.abi, provider);

// Define API functions to interact with the smart contract
export const getTotalBoomerangs = async () => {
  const totalBoomerangs = await contract.getTotalBoomerangs();
  return totalBoomerangs.toNumber();
};

export const getBoomerangInfo = async (id) => {
  const [expiryTime, updateFrequency, lastCheckInTime, creator] = await contract.getBoomerangInfo(id);
  return { expiryTime, updateFrequency, lastCheckInTime, creator };
};

export const isExpired = async (id) => {
  const expired = await contract.isExpired(id);
  return expired;
};

export const isUnlocked = async (id) => {
  const unlocked = await contract.isUnlocked(id);
  return unlocked;
};
