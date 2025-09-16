### Deployment

Contracts (Hardhat):
1. Install deps: `cd contracts && npm install`
2. Set network in CLI or env: `--network sepolia`
3. Deploy: `npx hardhat run scripts/deploy.ts --network sepolia`
4. Note addresses; set in backend `.env`

Backend:
1. `cd backend && npm install`
2. Copy `.env.example` to `.env` and fill `RPC_URL`, `PRIVATE_KEY`, `REGISTRY_ADDRESS`
3. Run: `npm run dev`

Admin Ops:
- Register projects via API or direct contract calls
- Assign verifiers using `addVerifier(address)` (admin only)
- Issue credits with `issueCredits(projectId, tokenId, to, amount)`


