import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  vite: () =>
    ({
      plugins: [tailwindcss()],
      build: {
        minify: "terser",
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ["console.log", "console.info", "console.debug"],
            passes: 2,
            unsafe_arrows: true,
            unsafe_comps: true,
            unsafe_math: true,
            unsafe_methods: true,
            arguments: true,
            booleans_as_integers: true,
            collapse_vars: true,
            comparisons: true,
            computed_props: true,
            conditionals: true,
            dead_code: true,
            directives: true,
            evaluate: true,
            hoist_funs: true,
            hoist_props: true,
            hoist_vars: true,
            if_return: true,
            inline: true,
            join_vars: true,
            loops: true,
            negate_iife: true,
            properties: true,
            reduce_vars: true,
            sequences: true,
            side_effects: true,
            switches: true,
            typeofs: true,
            unused: true,
          },
          mangle: {
            toplevel: true,
            safari10: true,
            properties: {
              regex: /^_/,
            },
          },
          format: {
            comments: false,
          },
        },
        rollupOptions: {
          treeshake: {
            moduleSideEffects: false,
            propertyReadSideEffects: false,
            tryCatchDeoptimization: false,
          },
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
        cssCodeSplit: true,
        assetsInlineLimit: 4096,
      },
    } as any),
  alias: {
    "@/common": "./src/common",
    "@/analytics": "./src/analytics",
    "@/services": "./src/services",
    "@/components": "./src/components",
    "@/context": "./src/context",
    "@/hooks": "./src/hooks",
    "@/utils": "./src/utils",
    "@/layouts": "./src/layouts",
    "@/pages": "./src/pages",
    "@/assets": "./src/assets",
  },
  modules: [
    "@wxt-dev/webextension-polyfill",
    "@wxt-dev/auto-icons",
    "@wxt-dev/module-react",
  ],
  manifest: {
    version: "1.0.13",
    name: "Widgetify",
    description:
      "Transform your new tab into a smart dashboard with Widgetify! Get currency rates, crypto prices, weather & more.",
    permissions: ["storage", "search"],
    browser_specific_settings: {
      gecko: {
        id: "widgetify@widgetify-app.github.io",
      },
    },
    host_permissions: [
      "https://github.com/*",
      "https://raw.githubusercontent.com/*",
      "https://api.github.com/*",
      "https://api.widgetify.ir/*",
      "https://www.google-analytics.com/collect*",
      "https://storage.c2.liara.space/*",
    ],
    icons: {
      16: "icons/icon16.png",
      32: "icons/icon32.png",
      48: "icons/icon48.png",
      128: "icons/icon128.png",
    },
  },
});
