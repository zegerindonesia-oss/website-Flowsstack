import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                flowtrade: resolve(__dirname, 'products/flowtrade/index.html'),
                flowpict: resolve(__dirname, 'products/flowpict/index.html'),
                flowhr: resolve(__dirname, 'products/flowhr/index.html'),
                flowqueue: resolve(__dirname, 'products/flowqueue/index.html'),
                flowbook: resolve(__dirname, 'products/flowbook/index.html'),
                flowtrain: resolve(__dirname, 'products/flowtrain/index.html'),
                flowmenu: resolve(__dirname, 'products/flowmenu/index.html'),
                flowpay: resolve(__dirname, 'products/flowpay/index.html'),
                flowcontent: resolve(__dirname, 'products/flowcontent/index.html'),
                flowstore: resolve(__dirname, 'products/flowstore/index.html'),
            },
        },
    },
});
