import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, sep } from 'node:path'

const STYLES_DIR = 'src/styles'
const THEME_DIR = join(STYLES_DIR, 'theme')
const TOKENS_DIR = join(STYLES_DIR, 'tokens')

function walk(dir: string, ext: string): string[] {
	return readdirSync(dir).flatMap((entry) => {
		const path = join(dir, entry)
		if (statSync(path).isDirectory()) return walk(path, ext)
		return path.endsWith(ext) ? [path] : []
	})
}

const styleSheets = [...walk(STYLES_DIR, '.css'), 'src/index.css']
const allCss = styleSheets.map((p) => readFileSync(p, 'utf8')).join('\n')

function definedClassNames(css: string): Set<string> {
	const names = new Set<string>()
	for (const m of css.matchAll(/@utility\s+([a-z0-9-]+)/g)) names.add(m[1])
	for (const m of css.matchAll(/\.([a-z][a-z0-9-]*)(?=[\s,{:])/g)) names.add(m[1])
	return names
}

function declaredClassGroups(source: string): string[] {
	const start = source.indexOf('classGroups:')
	const body = source.slice(start, source.indexOf('\n\t\t},', start))
	return [...body.matchAll(/\[([^\]]*)\]/gs)].flatMap((arr) =>
		[...arr[1].matchAll(/'([^']+)'/g)].map((s) => s[1])
	)
}

function pluginBlock(css: string): string {
	return css.slice(css.indexOf('{') + 1, css.indexOf('}'))
}

function declaredVariables(block: string): Set<string> {
	const names = new Set<string>()
	for (const m of block.matchAll(/--([a-z0-9-]+)\s*:/g)) names.add(m[1])
	if (/(?<![-a-z])color-scheme\s*:/.test(block)) names.add('color-scheme')
	return names
}

const themeFiles = readdirSync(THEME_DIR)
	.filter((f) => f.endsWith('.css') && f !== 'main.css' && f !== 'index.css')
	.map((f) => ({ name: f.replace('.css', ''), css: readFileSync(join(THEME_DIR, f), 'utf8') }))

describe('cn.ts vocabulary', () => {
	it('every class name it declares exists in a stylesheet', () => {
		const defined = definedClassNames(allCss)
		const missing = declaredClassGroups(readFileSync('src/common/utils/cn.ts', 'utf8'))
			.filter((name) => name.includes('-'))
			.filter((name) => !defined.has(name))

		expect(missing).toEqual([])
	})
})

describe('themes', () => {
	it('all declare the same variables', () => {
		const sets = themeFiles.map((t) => ({
			name: t.name,
			vars: [...declaredVariables(pluginBlock(t.css))].filter(
				(v) => !v.startsWith('glass')
			),
		}))
		const reference = [...sets[0].vars].sort()
		for (const theme of sets) {
			expect([theme.name, [...theme.vars].sort()]).toEqual([theme.name, reference])
		}
	})

	it('carry no daisyUI 4 -focus tokens', () => {
		const offenders = themeFiles
			.filter((t) => /--color-[a-z]+-focus\s*:/.test(t.css))
			.map((t) => t.name)

		expect(offenders).toEqual([])
	})

	it('declare a color-scheme, so native controls follow the theme', () => {
		const missing = themeFiles
			.filter((t) => !declaredVariables(pluginBlock(t.css)).has('color-scheme'))
			.map((t) => t.name)

		expect(missing).toEqual([])
	})
})

describe('semantic tokens', () => {
	it('are all read somewhere', () => {
		const declared = walk(TOKENS_DIR, '.css')
			.flatMap((p) => [...readFileSync(p, 'utf8').matchAll(/^\s*(--[a-z-]+)\s*:/gm)])
			.map((m) => m[1])
		const consumers = allCss + walk('src', '.ts').concat(walk('src', '.tsx'))
			.map((p) => readFileSync(p, 'utf8'))
			.join('\n')
		const unread = declared.filter(
			(token) => consumers.split(token).length - 1 < 2
		)

		expect(unread).toEqual([])
	})

	it('derive from a daisyUI variable, except the ones that must not follow the theme', () => {
		// --over-image-* is theme-independent by definition: it is drawn over a user
		// wallpaper, where the theme says nothing about what is behind it.
		const alwaysLiteral = ['--surface-overlay', '--control-knob']
		const hardcoded: string[] = []
		for (const path of walk(TOKENS_DIR, '.css')) {
			for (const m of readFileSync(path, 'utf8').matchAll(
				/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm
			)) {
				const [, name, value] = m
				const isShadow = value.includes('px')
				const isColour = !isShadow && /#|rgba?\(|oklch|color-mix/.test(value)
				if (isColour && !value.includes('var(--color-')) hardcoded.push(name)
			}
		}
		const unexpected = hardcoded.filter(
			(name) => !name.startsWith('--over-image-') && !alwaysLiteral.includes(name)
		)

		expect(unexpected).toEqual([])
	})
})

describe('brand colour', () => {
	it('matches the CSS variable it mirrors', () => {
		const ts = readFileSync('src/common/constants/brand.ts', 'utf8')
		const css = readFileSync(join(THEME_DIR, 'main.css'), 'utf8')
		const inTs = ts.match(/BRAND_PRIMARY\s*=\s*'([^']+)'/)?.[1]
		const inCss = css.match(/--brand-primary\s*:\s*([^;]+);/)?.[1].trim()

		expect(inTs?.toLowerCase()).toBe(inCss?.toLowerCase())
	})
})

describe('src', () => {
	it('uses no OS-keyed dark:/light: variants', () => {
		const offenders = walk('src', '.tsx')
			.filter((p) => /["'`\s](dark|light):[a-z]/.test(readFileSync(p, 'utf8')))

		expect(offenders).toEqual([])
	})
})

const BRAND: Record<string, string> = {
	'--brand-primary': '#536dfe',
	'--brand-secondary': '#7c8df0',
}

type Colour = { linear: [number, number, number]; alpha: number }

function oklchToLinear(L: number, C: number, H: number): [number, number, number] {
	const h = (H * Math.PI) / 180
	const a = C * Math.cos(h)
	const b = C * Math.sin(h)
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	].map((v) => Math.min(1, Math.max(0, v))) as [number, number, number]
}

function channelToLinear(byte: number): number {
	const c = byte / 255
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function parseColour(raw: string): Colour | null {
	let value = raw.trim()
	for (const [name, hex] of Object.entries(BRAND)) value = value.replace(`var(${name})`, hex)
	if (value.includes('var(')) return null

	const oklch = value.match(/^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/i)
	if (oklch)
		return { linear: oklchToLinear(+oklch[1] / 100, +oklch[2], +oklch[3]), alpha: 1 }

	const hex = value.match(/^#([0-9a-f]{3,8})$/i)
	if (hex) {
		const d = hex[1]
		const full = d.length <= 4 ? [...d].map((c) => c + c).join('') : d
		const byte = (i: number) => parseInt(full.slice(i, i + 2), 16)
		return {
			linear: [channelToLinear(byte(0)), channelToLinear(byte(2)), channelToLinear(byte(4))],
			alpha: full.length === 8 ? byte(6) / 255 : 1,
		}
	}

	const rgb = value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)\s*(?:[,/]\s*([\d.]+))?/i)
	if (rgb)
		return {
			linear: [channelToLinear(+rgb[1]), channelToLinear(+rgb[2]), channelToLinear(+rgb[3])],
			alpha: rgb[4] === undefined ? 1 : +rgb[4],
		}

	return null
}

function contrast(a: Colour, b: Colour): number {
	const luminance = ({ linear: [r, g, bl] }: Colour) => 0.2126 * r + 0.7152 * g + 0.0722 * bl
	const [x, y] = [luminance(a) + 0.05, luminance(b) + 0.05]
	return x > y ? x / y : y / x
}

const SURFACE_CONTENT_PAIRS: Array<[string, string]> = [
	['base-100', 'base-content'],
	['base-200', 'base-content'],
	['base-300', 'base-content'],
	['primary', 'primary-content'],
	['secondary', 'secondary-content'],
	['accent', 'accent-content'],
	['neutral', 'neutral-content'],
	['info', 'info-content'],
	['success', 'success-content'],
	['warning', 'warning-content'],
	['error', 'error-content'],
]

describe('theme contrast', () => {
	it('keeps every opaque surface/content pair above 3:1', () => {
		const failures: string[] = []
		for (const theme of themeFiles) {
			const block = pluginBlock(theme.css)
			const values: Record<string, string> = {}
			for (const m of block.matchAll(/--color-([a-z0-9-]+)\s*:\s*([^;]+);/g))
				values[m[1]] = m[2].trim()

			for (const [surfaceName, contentName] of SURFACE_CONTENT_PAIRS) {
				const surface = parseColour(values[surfaceName] ?? '')
				const content = parseColour(values[contentName] ?? '')
				if (!surface || !content) continue
				if (surface.alpha < 0.95 || content.alpha < 0.95) continue

				const ratio = contrast(surface, content)
				if (ratio < 3)
					failures.push(
						`${theme.name}: ${surfaceName}/${contentName} = ${ratio.toFixed(2)}:1`
					)
			}
		}

		expect(failures).toEqual([])
	})
})

// Files that are allowed to write colour literally, and why.
const LITERAL_COLOUR_ALLOWED = [
	// AGENTS.md: toasts are deliberately always dark, in every theme.
	'src/common/toast.tsx',
	// Content: the per-bookmark letter-avatar palette.
	'src/layouts/bookmark/components/bookmark/bookmark-icon.tsx',
]

function sourceFiles(): string[] {
	return [...walk('src', '.ts'), ...walk('src', '.tsx')]
		.map((p) => p.split(sep).join('/'))
		.filter((p) => !p.includes('__tests__'))
}

function offenders(pattern: RegExp, allowed: string[] = []): string[] {
	const found: string[] = []
	for (const path of sourceFiles()) {
		if (allowed.includes(path)) continue
		const lines = readFileSync(path, 'utf8').split('\n')
		lines.forEach((line, i) => {
			const hit = line.match(pattern)
			if (hit) found.push(`${path}:${i + 1} ${hit[0]}`)
		})
	}
	return found
}

describe('one way to say each thing', () => {
	it('never reaches past the tokens to a raw daisyUI base class', () => {
		expect(offenders(/[\w-]*-base-(100|200|300|content)(\/\[?[\d.]+\]?)?(?![\w-])/)).toEqual([])
	})

	it('never uses a raw Tailwind palette colour', () => {
		const palette =
			/(?<![\w-])(bg|text|border|border-[tblr]|ring|from|to|via|stroke|fill|divide|outline|placeholder)-(white|black|gray|slate|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-\d+)?(\/\[?[\d.]+\]?)?(?![\w-])/
		expect(offenders(palette, LITERAL_COLOUR_ALLOWED)).toEqual([])
	})

	it('uses the elevation scale rather than raw shadow sizes', () => {
		expect(offenders(/(?<![\w-])shadow-(sm|md|lg|xl|2xl)(?![\w-])/)).toEqual([])
	})

	it('uses one disabled opacity', () => {
		expect(offenders(/disabled:opacity-\d/)).toEqual([])
	})
})
