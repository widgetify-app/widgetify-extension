export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './**/node_modules/react-tailwindcss-select/**/*/*.esm.js',
    "./index.html"
  ],
  corePlugins: {
    backdropFilter: true,
  },
  theme: {
    extend: {
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(4px)',
        'blur-lg': 'blur(16px)',
      }
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        format: 'esm'
      }
    }
  },
  plugins: [],
}