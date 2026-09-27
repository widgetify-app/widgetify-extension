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
	'red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|stone|neutral'

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

	it('sizes text below text-xs from the scale, not by pixel', () => {
		const pattern =
			/(?<![\w-])(?:[a-z0-9\/-]+:)*!?text-\[((8|9|10|11|11\.5)px|0?\.(5625|625|65|6875|7)rem)\]/
		expect(offenders(pattern)).toEqual([])
	})

	it('puts page-wide layers on a named z-index', () => {
		const pattern = /(?<![\w-])(?:[a-z0-9\/-]+:)*!?z-\[\d{3,}\]/
		expect(offenders(pattern)).toEqual([])
	})

	it('never uses the OS-keyed dark:/light: variants', () => {
		expect(offenders(/["'`\s](dark|light):[a-z]/)).toEqual([])
	})

	it('never writes a colour literal into a class', () => {
		// toast.tsx is the one surface that deliberately follows no theme: it
		// is drawn over whatever is on screen and has to read the same on all
		// six. Its palette is fixed on purpose.
		const pattern =
			/(?<![\w-])(bg|text|border|ring|from|to|via|fill|stroke|outline|divide)-\[#[0-9a-fA-F]{3,8}\]/
		const paintsContent = [
			'src/layouts/bookmark/components/bookmark/bookmark-icon.tsx',
			'src/layouts/widgets/tools/pomodoro/top-users/top-user-item.tsx',
		]
		const allowed = ['src/common/toast.tsx', ...paintsContent]
		const bad = offenders(pattern).filter(
			(o) => !allowed.some((path) => o.startsWith(`${path}:`))
		)
		expect(bad).toEqual([])
	})
})

describe('elevation', () => {
	it('uses only the four shadow steps elevation.css defines', () => {
		const pattern =
			/(?<![\w-])(?:[a-z0-9\/-]+:)*!?(shadow-(2xs|xs|2xl|inner)|elevation-[a-z]+)(?![\w-])/
		expect(offenders(pattern)).toEqual([])
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
	const tokens = readFileSync(join(STYLES, 'tokens.css'), 'utf8')

	it('keeps utilities.css to names, not colour literals', () => {
		const css = readFileSync(join(STYLES, 'utilities.css'), 'utf8')
		const bad: string[] = []
		for (const block of css.split('@utility').slice(1)) {
			const name = block.trim().split(/\s/)[0]
			for (const m of block.matchAll(/:\s*(#[0-9a-f]{3,8}|rgba?\([\d\s,.]+\))/gi)) {
				if (m[1].startsWith('rgba(var')) continue
				bad.push(`${name}: ${m[1]}`)
			}
		}
		expect(bad).toEqual([])
	})

	it('builds every token in tokens.css from a theme variable', () => {
		const drawnOverImage = /^--color-(image-|scrim)/
		const bad = [...tokens.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm)]
			.filter(
				([, name, value]) =>
					!name.startsWith('--color-') ||
					!(
						value.startsWith('rgba(var(--color-') ||
						value.startsWith('var(--color-') ||
						drawnOverImage.test(name)
					)
			)
			.map(([, name, value]) => `${name}: ${value}`)
		expect(bad).toEqual([])
	})

	it('names only colours that tokens.css or the theme declare', () => {
		const declared = [...tokens.matchAll(/^\s*--color-([a-z0-9-]+)\s*:/gm)].map(
			(m) => m[1]
		)
		const declaredByTheTheme = ['secondary', 'success', 'warning', 'info', 'vip']
		const vocabulary = new Set([...declared, ...declaredByTheTheme])
		const pattern =
			/(?<![\w-])(?:[a-z0-9\/-]+:)*!?(?:bg|text|border(?:-[tblrxyse])?|ring(?:-offset)?|outline|from|to|via|divide|fill|stroke|shadow|placeholder|caret|accent|decoration)-((?:fg|surface|fill|line|on|brand|danger|success|warning|info|secondary|vip|image|scrim|primary|error|accent|neutral|widget|content|raised|subtle|hovered|strong|muted|faint|ghost|bold|over-image|medal|avatar)(?:-[a-z0-9]+)*)!?(?![\w-])/g
		const bad: string[] = []
		for (const path of sourceFiles()) {
			readFileSync(path, 'utf8')
				.split('\n')
				.forEach((line, i) => {
					for (const m of line.matchAll(pattern)) {
						if (!vocabulary.has(m[1])) bad.push(`${path}:${i + 1} ${m[0]}`)
					}
				})
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
		// The whole file, not just the @plugin block: the channel triples live
		// in a [data-theme] rule after it, and they are the half that breaks
		// silently when a theme forgets them.
		const sets = themeFiles.map((t) => ({
			name: t.name,
			vars: [...t.css.matchAll(/--([a-z0-9-]+)\s*:/g)]
				.map((m) => m[1])
				.filter((v) => !v.startsWith('glass'))
				.sort(),
		}))
		for (const theme of sets) {
			expect([theme.name, theme.vars]).toEqual([theme.name, sets[0].vars])
		}
	})

	// Every rgba() token in the system reads one of these. daisyUI drops any
	// value containing a comma from its @plugin block, so they have to be
	// declared outside it - and a theme that omits one ships a colour that is
	// invalid at computed-value time, which renders as an inherited colour
	// rather than as nothing. Name them explicitly so the failure says which.
	const CHANNELS = [
		...['base-100', 'base-200', 'base-300'].flatMap((s) => [
			`--color-${s}-rgb`,
			`--color-${s}-a`,
		]),
		...[
			'base-content',
			'primary',
			'secondary',
			'error',
			'success',
			'warning',
			'info',
			'success-content',
			'warning-content',
			'error-content',
		].map((c) => `--color-${c}-rgb`),
	]

	it('all declare the channel variables the rgba() tokens read', () => {
		const missing = themeFiles.flatMap((t) =>
			CHANNELS.filter((v) => !t.css.includes(`${v}:`)).map(
				(v) => `${t.name}: ${v}`
			)
		)
		expect(missing).toEqual([])
	})

	it('declares the channels outside the @plugin block, where daisyUI keeps them', () => {
		const swallowed = themeFiles.flatMap((t) =>
			CHANNELS.filter((v) => pluginBlock(t.css).includes(`${v}:`)).map(
				(v) => `${t.name}: ${v}`
			)
		)
		expect(swallowed).toEqual([])
	})

	it('all declare a color-scheme so native controls follow the theme', () => {
		const missing = themeFiles
			.filter((t) => !/color-scheme\s*:/.test(pluginBlock(t.css)))
			.map((t) => t.name)
		expect(missing).toEqual([])
	})
})
