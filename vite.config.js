import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


const newLocal = 'https://data.nhi.gov.tw/Datasets/Download.ashx?rid=A21030000I-D03001-001&l=https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv'
// const newLocal = 'https://quality.data.gov.tw/dq_download_json.php?nid=152408&md5_url=8699cd0ecbfcc5b30a577b53026fe02b'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    proxy:{
      '/phar':{
        target:newLocal,
        changeOrigin:true,
        secure : false,
      }
    }
  }
})


