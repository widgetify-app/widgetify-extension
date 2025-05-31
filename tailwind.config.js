export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './**/node_modules/react-tailwindcss-select/**/*/*.esm.js',
    './index.html',
  ],
  corePlugins: {
    backdropFilter: true,
  },
  theme: {
    extend: {
      colors: {
        // Glass theme colors
        glass: {
          card: 'rgba(28, 28, 28, 0.65)',
          text: '#E5E7EB',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        // Light theme colors
        light: {
          card: 'rgba(255, 255, 255, 0.85)',
          text: '#333333',
          border: 'rgba(0, 0, 0, 0.1)',
        },
        // Dark theme colors
        dark: {
          card: 'rgba(30, 30, 30, 0.95)',
          text: '#E0E0E0',
          border: 'rgba(255, 255, 255, 0.05)',
        },
      },
      backdropFilter: {
        none: 'none',
        blur: 'blur(4px)',
        'blur-lg': 'blur(16px)',
      },
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        format: 'esm',
      },
    },
  },
  plugins: [],
}
