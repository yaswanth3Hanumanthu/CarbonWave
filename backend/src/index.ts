import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { getRegistry } from './eth';
import { putJSON, putFiles } from './ipfs';

const app = express();
app.use(express.json({ limit: '10mb' }));
const upload = multer({ storage: multer.memoryStorage() });

const projectSchema = z.object({
  ownerAddress: z.string().min(1),
  metadataURI: z.string().url(),
  geoHash: z.string().min(4),
});

const fieldDataSchema = z.object({
  projectId: z.number().int().positive(),
  observedAt: z.string(),
  location: z.object({ lat: z.number(), lon: z.number() }),
  measurements: z.array(
    z.object({
      type: z.enum(['biomass', 'soil_carbon', 'salinity', 'canopy_height']),
      unit: z.string(),
      value: z.number(),
      method: z.string().optional(),
    })
  ),
  media: z.array(
    z.object({ kind: z.enum(['photo', 'video', 'drone_map']), uri: z.string() })
  ).optional(),
});

app.post('/projects', async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const { ownerAddress, metadataURI, geoHash } = parsed.data;
    const registry = getRegistry();
    const tx = await registry.registerProject(ownerAddress, metadataURI, `0x${Buffer.from(geoHash).toString('hex')}`);
    const receipt = await tx.wait();
    const projectId = await registry.nextProjectId();
    return res.status(201).json({ projectId: Number(projectId) - 1 });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/projects/:id/data', upload.none(), async (req, res) => {
  const body = { ...req.body, projectId: Number(req.params.id) };
  const parsed = fieldDataSchema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  // Persist payload to IPFS and return URI (off-chain reference)
  try {
    const uri = await putJSON(`project-${req.params.id}-data.json`, parsed.data);
    return res.status(201).json({ ok: true, uri });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    if (!files.length) return res.status(400).json({ error: 'No files' });
    const cidUri = await putFiles(
      files.map((f) => ({ buffer: f.buffer, filename: f.originalname, mime: f.mimetype }))
    );
    return res.status(201).json({ uri: cidUri });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});


