import { Web3Storage, File } from 'web3.storage';

function getClient() {
  const token = process.env.WEB3_STORAGE_TOKEN || '';
  if (!token) throw new Error('WEB3_STORAGE_TOKEN missing');
  return new Web3Storage({ token });
}

export async function putJSON(name: string, obj: unknown) {
  const client = getClient();
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const file = new File([blob], name, { type: 'application/json' });
  const cid = await client.put([file], { wrapWithDirectory: false });
  return `ipfs://${cid}`;
}

export async function putFiles(files: { buffer: Buffer; filename: string; mime?: string }[]) {
  const client = getClient();
  const web3Files = files.map((f) => new File([new Blob([f.buffer])], f.filename, { type: f.mime } as any));
  const cid = await client.put(web3Files);
  return `ipfs://${cid}`;
}


