#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { ethers } from 'ethers';

const program = new Command();

function getProvider() {
  const url = process.env.RPC_URL || '';
  if (!url) throw new Error('RPC_URL missing');
  return new ethers.JsonRpcProvider(url);
}

function getSigner() {
  const pk = process.env.PRIVATE_KEY || '';
  if (!pk) throw new Error('PRIVATE_KEY missing');
  return new ethers.Wallet(pk, getProvider());
}

function getContract(address: string, abi: any) {
  return new ethers.Contract(address, abi, getSigner());
}

const REG_ABI = [
  { "inputs": [ {"internalType":"address","name":"owner","type":"address"}, {"internalType":"string","name":"metadataURI","type":"string"}, {"internalType":"bytes32","name":"geoHash","type":"bytes32"}], "name":"registerProject", "outputs": [ {"internalType":"uint256","name":"","type":"uint256"} ], "stateMutability":"nonpayable", "type":"function" },
  { "inputs": [ {"internalType":"address","name":"verifier","type":"address"} ], "name":"addVerifier", "outputs": [], "stateMutability":"nonpayable", "type":"function" },
  { "inputs": [ {"internalType":"uint256","name":"projectId","type":"uint256"}, {"internalType":"uint256","name":"tokenId","type":"uint256"}, {"internalType":"address","name":"to","type":"address"}, {"internalType":"uint256","name":"amount","type":"uint256"} ], "name":"issueCredits", "outputs": [], "stateMutability":"nonpayable", "type":"function" }
];

program
  .name('carbonwave')
  .description('Admin CLI for CarbonWave')
  .version('0.1.0');

program.command('register')
  .requiredOption('-r, --registry <address>', 'Registry address')
  .requiredOption('-o, --owner <address>', 'Project owner address')
  .requiredOption('-m, --meta <uri>', 'Metadata URI')
  .requiredOption('-g, --geohash <hash>', 'Geohash string')
  .action(async (opts) => {
    const registry = getContract(opts.registry, REG_ABI);
    const geoHex = '0x' + Buffer.from(opts.geohash).toString('hex');
    const tx = await registry.registerProject(opts.owner, opts.meta, geoHex);
    const rc = await tx.wait();
    console.log('Registered. Tx:', rc?.hash);
  });

program.command('add-verifier')
  .requiredOption('-r, --registry <address>', 'Registry address')
  .requiredOption('-v, --verifier <address>', 'Verifier address')
  .action(async (opts) => {
    const registry = getContract(opts.registry, REG_ABI);
    const tx = await registry.addVerifier(opts.verifier);
    const rc = await tx.wait();
    console.log('Verifier added. Tx:', rc?.hash);
  });

program.command('issue')
  .requiredOption('-r, --registry <address>', 'Registry address')
  .requiredOption('-p, --project <id>', 'Project ID')
  .requiredOption('-t, --token <id>', 'Token ID')
  .requiredOption('-a, --amount <amt>', 'Amount')
  .requiredOption('-b, --beneficiary <address>', 'Beneficiary address')
  .action(async (opts) => {
    const registry = getContract(opts.registry, REG_ABI);
    const tx = await registry.issueCredits(Number(opts.project), Number(opts.token), opts.beneficiary, Number(opts.amount));
    const rc = await tx.wait();
    console.log('Issued. Tx:', rc?.hash);
  });

program.parseAsync().catch((e) => {
  console.error(e);
  process.exit(1);
});


