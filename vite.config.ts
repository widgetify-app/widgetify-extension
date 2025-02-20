import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import webExtension, { readJsonFile } from 'vite-plugin-web-extension'

function generateManifest() {
	const manifest = readJsonFile('src/manifest.json')
	const pkg = readJsonFile('package.json')
	return {
		name: pkg.name,
		description: pkg.description,
		version: pkg.version,
		...manifest,
	}
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		webExtension({
			manifest: generateManifest,
		}),
	],
})
