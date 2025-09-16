import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Credits = await ethers.getContractFactory("BlueCarbonCredits");
  const credits = await Credits.deploy("https://example.com/metadata/{id}.json", deployer.address);
  await credits.waitForDeployment();
  console.log("BlueCarbonCredits:", await credits.getAddress());

  const Registry = await ethers.getContractFactory("CarbonRegistry");
  const registry = await Registry.deploy(credits.getAddress(), deployer.address);
  await registry.waitForDeployment();
  console.log("CarbonRegistry:", await registry.getAddress());

  // grant registry minter role
  const MINTER_ROLE = ethers.id("MINTER_ROLE");
  await (await credits.grantRole(MINTER_ROLE, await registry.getAddress())).wait();
  console.log("Granted MINTER_ROLE to registry");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


