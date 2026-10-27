import { Pool } from 'pg';
import { Database } from '@hocuspocus/extension-database';

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
      const result = await pool.query(
        'SELECT data FROM document_content WHERE document_id = $1',
        [documentName]
      );
      if (result.rows.length === 0) {
        return null;
      }
      return new Uint8Array(result.rows[0].data);
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
  })
};