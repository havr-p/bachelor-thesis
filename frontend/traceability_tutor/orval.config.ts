import { defineConfig } from "orval";

export default defineConfig({
  evo: {
    output: {
      mode: "tags",
      schemas: "api/model",
      target: "api/services",
      client: 'angular',
      mock: false, // enable/disable test mock generation
      // I recommend enabling this option if you generate an api client
      prettier: false, // recommended if you use prettier
      clean: true, // recreate the whole folder (avoid outdated files)
      override: {
        useDates: true,
        useNativeEnums: true,
      },
    },
    input: {
      target: "http://localhost:8080/v3/api-docs",
    },
  },

});
