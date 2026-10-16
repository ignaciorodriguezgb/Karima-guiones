# Guiones de Reels — Altamira Legal (Vercel)

Página editable cuyos cambios se guardan en el servidor (Vercel Blob) y se ven desde cualquier dispositivo.

## Subir a Vercel

1. Subí esta carpeta a un repo de GitHub e importalo en Vercel (o `vercel deploy` desde la carpeta).
   Framework: **Other**. No hace falta build command. Output directory: `public`.
2. En el proyecto de Vercel: **Storage → Create → Blob** y conectalo al proyecto.
   Eso crea la variable `BLOB_READ_WRITE_TOKEN` automáticamente.
3. Redeploy. Listo: `/` muestra los guiones, `/api/guiones` guarda y lee los cambios.

## Archivos

- `public/index.html` — la página (ya generada, lista para servir).
- `api/guiones.js` — función serverless: GET devuelve lo guardado, POST guarda.
- `package.json` — dependencia `@vercel/blob`.
- `state.json`, `build.cjs`, `runtime.js` — solo para regenerar `index.html` si cambiás los guiones base (`node build.cjs`). No hacen falta para el deploy.

## Nota

Cualquiera con el link puede editar y guardar. Si querés restringirlo, activá **Vercel Password Protection** en el proyecto (Settings → Deployment Protection).
