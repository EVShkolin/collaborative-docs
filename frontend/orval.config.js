// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
  collaborativeDocs: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/shared/api/apiClient',
      schemas: './src/shared/api/model',
      client: 'axios',
      override: {
        mutator: {
          path: './src/shared/api/client.config.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
