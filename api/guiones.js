// GET  /api/guiones  -> devuelve el JSON guardado (o 404 si todavía no hay nada guardado)
// POST /api/guiones  -> guarda el JSON recibido en Vercel Blob
import { put, list } from "@vercel/blob";

const KEY = "altamira/guiones-reels.json";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const { blobs } = await list({ prefix: KEY, limit: 1 });
      if (!blobs.length) return res.status(404).json({ error: "sin datos" });
      const r = await fetch(blobs[0].url, { cache: "no-store" });
      const json = await r.json();
      return res.status(200).json(json);
    }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || !Array.isArray(body.reels)) return res.status(400).json({ error: "formato inválido" });
      await put(KEY, JSON.stringify(body), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
      return res.status(200).json({ ok: true });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "método no permitido" });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
}
