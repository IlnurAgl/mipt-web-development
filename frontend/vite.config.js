import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic' // Add this line
  }), viteTsconfigPaths(), svgrPlugin()],
  // resolve: {
  //   alias: {
  //     '@/': `${path.resolve(__dirname, 'src')}/`,
  //   },
  // },
  // server: {
  //   fs: {
  //     cachedChecks: false
  //   }
  // }
})
