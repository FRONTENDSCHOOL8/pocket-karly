import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        header: resolve(__dirname, 'src/pages/components/header.html'),
        // footer: resolve(__dirname, 'src/pages/components/footer.html'),
      },
    },
  },
});
