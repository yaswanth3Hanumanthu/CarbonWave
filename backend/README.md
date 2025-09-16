### Backend API

Env:
```
PORT=3000
RPC_URL=
PRIVATE_KEY=
REGISTRY_ADDRESS=
TOKEN_ADDRESS=
WEB3_STORAGE_TOKEN=
```

Endpoints:
- POST `/projects` { ownerAddress, metadataURI, geoHash }
- POST `/projects/:id/data` JSON field data; returns `ipfs://...` URI
- POST `/upload` multipart `files[]`; returns directory `ipfs://...` URI


