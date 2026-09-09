import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
export default defineConfig({plugins:[react()],css:{postcss:{plugins:[tailwindcss()]}},define:{'process.env.NODE_ENV':JSON.stringify('production')},base:'./',build:{outDir:'portable-dist',emptyOutDir:false,lib:{entry:'brand-portable.tsx',name:'EnzoBrandStudy',formats:['iife'],fileName:()=> 'brand.js',cssFileName:'brand'}}});
