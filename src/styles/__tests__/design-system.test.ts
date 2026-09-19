import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, sep } from 'node:path'

const STYLES = 'src/styles'
const THEMES = join(STYLES, 'theme')

function walk(dir: string, ext: string): string[] {
	return readdirSync(dir).flatMap((entry) => {
		const path = join(dir, entry)
		if (statSync(path).isDirectory()) return walk(path, ext)
		return path.endsWith(ext) ? [path] : []
	})
}

function sourceFiles(): string[] {
	return [...walk('src', '.ts'), ...walk('src', '.tsx')]
		.map((p) => p.split(sep).join('/'))
		.filter((p) => !p.includes('__tests__'))
}

function offenders(pattern: RegExp): string[] {
	const found: string[] = []
	for (const path of sourceFiles()) {
		readFileSync(path, 'utf8')
			.split('\n')
			.forEach((line, i) => {
				const hit = line.match(pattern)
				if (hit) found.push(`${path}:${i + 1} ${hit[0]}`)
			})
	}
	return found
}

const PALETTE =
	'red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|stone'

describe('one vocabulary', () => {
	it('never uses a Tailwind palette colour', () => {
		const pattern = new RegExp(
			`(?<![\\w-])(bg|text|border|border-[tblr]|ring|from|to|via|stroke|fill|divide|outline|placeholder|shadow)-(${PALETTE})-\\d{2,3}(?![\\w-])`
		)
		expect(offenders(pattern)).toEqual([])
	})

	it('never puts an opacity modifier on a colour utility', () => {
		const pattern =
			/(?<![\w-])(bg|text|border|border-[tblr]|ring|divide|from|to|via|outline|fill|stroke|shadow)-[a-z0-9-]+\/\d+(?![\w-])/
		expect(offenders(pattern)).toEqual([])
	})

	it('never reaches past the tokens to a raw daisyUI base class', () => {
		const pattern = /(?<![\w-])[\w-]*-base-(100|200|300|content)(?![\w-])/
		expect(offenders(pattern)).toEqual([])
	})

	it('never uses the OS-keyed dark:/light: variants', () => {
		expect(offenders(/["'`\s](dark|light):[a-z]/)).toEqual([])
	})
})

describe('stylesheets stay parseable on Chrome 109', () => {
	const ours = [...walk(STYLES, '.css'), 'src/index.css']
		.filter((p) => !p.includes('__tests__'))
		.map((p) => ({ path: p, css: readFileSync(p, 'utf8') }))

	it('write no oklch()', () => {
		const bad = ours.filter((f) =>
			/oklch\(/.test(f.css.replace(/\/\*[\s\S]*?\*\//g, ''))
		)
		expect(bad.map((f) => f.path)).toEqual([])
	})

	it('write no color-mix()', () => {
		const bad = ours.filter((f) =>
			/color-mix\(/.test(f.css.replace(/\/\*[\s\S]*?\*\//g, ''))
		)
		expect(bad.map((f) => f.path)).toEqual([])
	})
})

describe('colour lives in one place', () => {
	const theme = readFileSync(join(STYLES, 'theme.css'), 'utf8')

	it('declares accents as a ramp step or a plain rgba of a theme token', () => {
		const accents = theme.slice(
			theme.indexOf('ACCENTS'),
			theme.indexOf('CONTENT COLOURS')
		)
		const bad: string[] = []
		for (const m of accents.matchAll(/^\s*(--color-[a-z0-9-]+)\s*:\s*([^;]+);/gm)) {
			const [, name, value] = m
			// -rgb holds channels, not a colour
			if (name.endsWith('-rgb')) continue
			const ok =
				value.startsWith('rgba(var(--color-') ||
				value.startsWith('var(--color-') ||
				/^#[0-9a-f]{6}$/i.test(value.trim())
			if (!ok) bad.push(`${name}: ${value}`)
		}
		expect(bad).toEqual([])
	})

	it('keeps utilities.css to names, not colour literals', () => {
		// Two exceptions: over-image chrome follows no theme, and the modal
		// scrim is a fixed black. Everything else must read a token.
		const css = readFileSync(join(STYLES, 'utilities.css'), 'utf8')
		const bad: string[] = []
		for (const block of css.split('@utility').slice(1)) {
			const name = block.trim().split(/\s/)[0]
			// over-image follows no theme; bg-overlay is a fixed scrim
			if (name.includes('over-image') || name === 'bg-overlay') continue
			for (const m of block.matchAll(/:\s*(#[0-9a-f]{3,8}|rgba?\([\d\s,.]+\))/gi)) {
				if (m[1].startsWith('rgba(var')) continue
				bad.push(`${name}: ${m[1]}`)
			}
		}
		expect(bad).toEqual([])
	})
})

describe('themes', () => {
	const themeFiles = readdirSync(THEMES)
		.filter((f) => f.endsWith('.css') && f !== 'main.css' && f !== 'index.css')
		.map((f) => ({
			name: f.replace('.css', ''),
			css: readFileSync(join(THEMES, f), 'utf8'),
		}))

	function pluginBlock(css: string): string {
		return css.slice(css.indexOf('{') + 1, css.indexOf('\n}'))
	}

	it('all declare the same variables', () => {
		const sets = themeFiles.map((t) => ({
			name: t.name,
			vars: [...pluginBlock(t.css).matchAll(/--([a-z0-9-]+)\s*:/g)]
				.map((m) => m[1])
				.filter((v) => !v.startsWith('glass'))
				.sort(),
		}))
		for (const theme of sets) {
			expect([theme.name, theme.vars]).toEqual([theme.name, sets[0].vars])
		}
	})

	it('all declare a color-scheme so native controls follow the theme', () => {
		const missing = themeFiles
			.filter((t) => !/color-scheme\s*:/.test(pluginBlock(t.css)))
			.map((t) => t.name)
		expect(missing).toEqual([])
	})
})
