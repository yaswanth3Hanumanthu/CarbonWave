import { expect } from "chai";
import { ethers } from "hardhat";

describe("CarbonRegistry", function () {
  it("registers project and issues credits", async function () {
    const [admin, ngo, beneficiary, verifier] = await ethers.getSigners();

    const Credits = await ethers.getContractFactory("BlueCarbonCredits");
    const credits = await Credits.connect(admin).deploy("ipfs://base/{id}.json", admin.address);
    await credits.waitForDeployment();

    const Registry = await ethers.getContractFactory("CarbonRegistry");
    const registry = await Registry.connect(admin).deploy(credits.getAddress(), admin.address);
    await registry.waitForDeployment();

    const MINTER_ROLE = ethers.id("MINTER_ROLE");
    await credits.grantRole(MINTER_ROLE, await registry.getAddress());

    const geoHash = ethers.keccak256(ethers.toUtf8Bytes("te7tq7"));
    const tx = await registry.registerProject(await ngo.getAddress(), "ipfs://project.json", geoHash);
    const receipt = await tx.wait();
    const event = receipt!.logs.find(() => true);
    expect(await registry.nextProjectId()).to.equal(2n);

    await registry.addVerifier(await verifier.getAddress());
    await expect(registry.connect(verifier).verify(1, "ipfs://evidence"))
      .to.emit(registry, "Verified");

    await expect(registry.issueCredits(1, 2025, await beneficiary.getAddress(), 1000))
      .to.emit(registry, "Issued");

    expect(await credits.balanceOf(await beneficiary.getAddress(), 2025)).to.equal(1000);
  });
});


