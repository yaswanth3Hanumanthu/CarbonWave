### CarbonWave: Blockchain-powered Blue Carbon MRV & Registry

CarbonWave is a reference implementation for a decentralized Monitoring, Reporting, and Verification (MRV) platform focused on blue carbon ecosystem restoration in India. It provides:

- Verified project and restoration data immutably stored on-chain
- Tokenized carbon credits via smart contracts
- Onboarding flows for NGOs, communities, and coastal panchayats
- Backend APIs for ingesting field data from mobile apps and drones

#### Architecture Overview

- Smart Contracts (Solidity)
  - `CarbonRegistry` records projects, issuances, and verifications on-chain
  - `BlueCarbonCredits` is an ERC-1155 token for fungible, vintage/standard-specific credits

- Backend (Node.js + TypeScript)
  - Ingests MRV field data (mobile, drones), validates against JSON Schemas, stores off-chain metadata (e.g., IPFS link), and orchestrates on-chain calls

- Mobile (placeholder)
  - Uploads field observations, geo-tagged plots, and drone data references

- Admin Tools (docs + scripts)
  - Guidance for NCCR to operate the registry, issue/revoke credits, and onboard NGOs

#### Monorepo Structure

```
contracts/                 # Solidity smart contracts
backend/                   # TypeScript Express API for MRV ingestion
mobile/                    # Placeholder docs for mobile app flows
docs/                      # Ops, deployment, and onboarding guides
```

#### Smart Contract Summary

- `CarbonRegistry` maintains:
  - Projects: owner NGO, metadata URI (e.g., IPFS), geospatial hash, status
  - Verifications: third-party attestations with evidence URIs
  - Issuances: links a project to minted credits in `BlueCarbonCredits`

- `BlueCarbonCredits` (ERC-1155):
  - Token ID encodes method/vintage/standard or can be mapped via metadata
  - Mint/burn gated to `CarbonRegistry`

#### Backend Summary

- Endpoints (initial):
  - `POST /projects` register a project (writes on-chain via signer)
  - `POST /projects/:id/data` upload MRV field data; validates JSON schema; stores to object store/IPFS; records reference

#### Quick Start

- Contracts:
  - Use Hardhat or Foundry; see `contracts/README.md`

- Backend:
  - `cd backend && npm install && npm run dev`

#### Security & Compliance

- Addresses role-based access control (NCCR admin, NGO project owners, verifiers)
- Data integrity via content-addressed URIs (e.g., IPFS)
- Auditability: on-chain events for all critical transitions


