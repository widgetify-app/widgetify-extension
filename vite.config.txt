import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import webExtension, { readJsonFile } from 'vite-plugin-web-extension'

function generateManifest(browser: any) {
	const manifest = readJsonFile('src/manifest.json')
	const pkg = readJsonFile('package.json')

	const processedManifest = JSON.parse(
		JSON.stringify(manifest).replace(new RegExp(`{{${browser}}}\\.`, 'g'), ''),
	)

	const otherBrowser = browser === 'firefox' ? 'chrome' : 'firefox'
	for (const key of Object.keys(processedManifest)) {
		if (key.startsWith(`{{${otherBrowser}}}.`)) {
			delete processedManifest[key]
		}
	}

	const processNestedObjects = (obj: any) => {
		for (const key of Object.keys(obj)) {
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				for (const nestedKey of Object.keys(obj[key])) {
					if (nestedKey.startsWith(`{{${otherBrowser}}}.`)) {
						delete obj[key][nestedKey]
					}
					if (nestedKey.startsWith(`{{${browser}}}.`)) {
						const newKey = nestedKey.replace(`{{${browser}}}.`, '')
						obj[key][newKey] = obj[key][nestedKey]
						delete obj[key][nestedKey]
					}
				}

				processNestedObjects(obj[key])
			}
		}
	}

	processNestedObjects(processedManifest)

	return {
		name: pkg.name,
		description: pkg.description,
		version: pkg.version,
		...processedManifest,
	}
}

export default defineConfig(({ mode }) => {
	const browser = mode === 'firefox' ? 'firefox' : 'chrome'

	return {
		plugins: [
			react(),
			tailwindcss(),
			webExtension({
				manifest: () => generateManifest(browser),
				browser,
			}),
		],
		resolve: {
			alias: {
				'@': '/src',
			},
		},
		build: {
			outDir: 'dist',
			emptyOutDir: true,
		},
	}
})
