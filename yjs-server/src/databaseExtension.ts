import { Pool } from 'pg';
import { Database } from '@hocuspocus/extension-database';
import { createPageSeed } from './document-state/createPageSeed';

const pool = new Pool({
  port: parseInt(process.env.POSTGRES_PORT!, 10),
  host: process.env.POSTGRES_HOST!,
  user: process.env.POSTGRES_USERNAME!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
});

export const databaseExtension = () => {
  return new Database({
    fetch: async ({ documentName }) => {
      const existing = await pool.query('SELECT data FROM document_content WHERE document_id = $1', [documentName]);
      if (existing.rows.length > 0) {
        return new Uint8Array(existing.rows[0].data);
      }

      const seed = createPageSeed();
      const inserted = await pool.query(
        `INSERT INTO document_content (document_id, data, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (document_id) DO NOTHING 
           RETURNING data`,
        [documentName, Buffer.from(seed)]
      );

      if (inserted.rows.length > 0) {
        return new Uint8Array(inserted.rows[0].data);
      }

      const fallback = await pool.query('SELECT data FROM document_content WHERE document_id = $1', [documentName]);
      return new Uint8Array(fallback.rows[0].data);
    },

    store: async ({ documentName, state }) => {
      await pool.query(
        `INSERT INTO document_content (document_id, data, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (document_id)
           DO UPDATE SET data = $2, updated_at = NOW()`,
        [documentName, Buffer.from(state)]
      );
    },
  });
};
