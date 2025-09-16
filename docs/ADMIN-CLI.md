### Admin CLI

Install:
```
cd tools/admin-cli && npm install && npm run build
```

Env:
```
RPC_URL=
PRIVATE_KEY=
```

Commands:
```
node dist/index.js register -r <REGISTRY> -o <OWNER> -m <IPFS_URI> -g <GEOHASH>
node dist/index.js add-verifier -r <REGISTRY> -v <ADDRESS>
node dist/index.js issue -r <REGISTRY> -p <PROJECT_ID> -t <TOKEN_ID> -a <AMOUNT> -b <BENEFICIARY>
```


