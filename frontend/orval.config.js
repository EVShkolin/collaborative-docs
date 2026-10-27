module.exports = {
  api: {
    input: './openapi.yaml',
    output: {
      target: './src/api/apiClient.ts',
      client: 'axios',

      override: {
        mutator: {
          path: './src/api/client.config.ts',
          name: 'customInstance',
        },
      },
    },
  },
};