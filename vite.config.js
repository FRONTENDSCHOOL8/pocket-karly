import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        header: resolve(__dirname, 'src/pages/components/header.html'),
        footer: resolve(__dirname, 'src/pages/components/footer.html'),
        popup: resolve(__dirname, 'src/pages/components/popup.html'),
        sidebar: resolve(__dirname, 'src/pages/components/sidebar.html'),
        register: resolve(__dirname, 'src/pages/register/index.html'),
        detail2: resolve(__dirname, 'src/pages/detail/index2.html'),
        productBox: resolve(__dirname, 'src/pages/components/productBox.html'),
        addCart: resolve(__dirname, 'src/pages/components/addCart.html'),
        productList: resolve(__dirname, 'src/pages/productList/index.html'),
        detail: resolve(__dirname, 'src/pages/detail/index.html'),
        login: resolve(__dirname, 'src/pages/login/index.html'),
        cart: resolve(__dirname, 'src/pages/cart/index.html'),
      },
    },
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
});
