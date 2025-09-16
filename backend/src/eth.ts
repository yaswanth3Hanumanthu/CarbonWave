import { ethers } from 'ethers';
import { CarbonRegistryABI } from './abi/CarbonRegistry';

const rpcUrl = process.env.RPC_URL || '';
const privateKey = process.env.PRIVATE_KEY || '';
const registryAddress = process.env.REGISTRY_ADDRESS || '';

export function getProvider() {
  if (!rpcUrl) throw new Error('RPC_URL missing');
  return new ethers.JsonRpcProvider(rpcUrl);
}

export function getSigner() {
  if (!privateKey) throw new Error('PRIVATE_KEY missing');
  return new ethers.Wallet(privateKey, getProvider());
}

export function getRegistry() {
  if (!registryAddress) throw new Error('REGISTRY_ADDRESS missing');
  return new ethers.Contract(registryAddress, CarbonRegistryABI, getSigner());
}


