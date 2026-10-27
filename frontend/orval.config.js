import { defineConfig } from 'orval';

export default defineConfig({
  collabDoc: {
    input: './openapi.yaml',
    output: './src/apiClient.ts',
  },
});