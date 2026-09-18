import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, sep } from 'node:path'

const STYLES = 'src/styles'
const TOKENS = join(STYLES, 'tokens')
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

describe('token layer', () => {
	const tokenFiles = walk(TOKENS, '.css').filter((p) => !p.endsWith('index.css'))

	it('declares every token as a ramp step or an explicit exception', () => {
		// Allowed to hold a literal: over-image chrome, which is theme independent
		// by definition, and elevation, where the value is a geometry plus a
		// shadow colour rather than a ramp step.
		const allowLiteral =
			/^--(over-image-|elevation-|control-knob|surface-overlay|disabled-|focus-ring-(width|offset)|z-|line-height-)/
		const bad: string[] = []
		for (const path of tokenFiles) {
			for (const m of readFileSync(path, 'utf8').matchAll(
				/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm
			)) {
				const [, name, value] = m
				const isColour = /#|rgba?\(/.test(value)
				if (
					isColour &&
					!allowLiteral.test(name) &&
					!value.includes('var(--color-')
				) {
					bad.push(`${path} ${name}: ${value}`)
				}
			}
		}
		expect(bad).toEqual([])
	})

	it('has every token read by a utility or a stylesheet', () => {
		const declared = tokenFiles.flatMap((p) => [
			...readFileSync(p, 'utf8').matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm),
		])
		const all = [...walk(STYLES, '.css'), 'src/index.css']
			.map((p) => readFileSync(p, 'utf8'))
			.join('\n')
		const unread = declared
			.map((m) => m[1])
			.filter((token) => all.split(`var(${token})`).length - 1 < 1)
		expect(unread).toEqual([])
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
