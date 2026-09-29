import { beforeAll, describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'
import { compile } from 'tailwindcss'
import ts from 'typescript'

const STYLES = 'src/styles'
const THEMES = join(STYLES, 'themes')

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

function stylesheets(): { path: string; css: string }[] {
	return walk('src', '.css').map((p) => ({
		path: p.split(sep).join('/'),
		css: readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''),
	}))
}

interface CssNode {
	prelude: string
	body: string | null
}

function topLevel(css: string): CssNode[] {
	const nodes: CssNode[] = []
	let depth = 0
	let start = 0
	let prelude = ''
	for (let i = 0; i < css.length; i++) {
		if (css[i] === '{') {
			if (depth === 0) {
				prelude = css.slice(start, i).trim()
				start = i + 1
			}
			depth++
		} else if (css[i] === '}') {
			depth--
			if (depth === 0) {
				nodes.push({ prelude, body: css.slice(start, i) })
				start = i + 1
			}
		} else if (css[i] === ';' && depth === 0) {
			nodes.push({ prelude: css.slice(start, i).trim(), body: null })
			start = i + 1
		}
	}
	const rest = css.slice(start).trim()
	if (rest) nodes.push({ prelude: rest, body: null })
	return nodes
}

function declarationsOf(body: string): Map<string, string> {
	const found = new Map<string, string>()
	for (const node of topLevel(body)) {
		const at = node.prelude.indexOf(':')
		if (node.body === null && at > 0) {
			found.set(node.prelude.slice(0, at).trim(), node.prelude.slice(at + 1).trim())
		}
	}
	return found
}

function holdsOnlyVariables(body: string): boolean {
	return topLevel(body).every(
		(node) => node.body === null && node.prelude.startsWith('--')
	)
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

	it('sizes text from the scale, never by pixel or rem', () => {
		const pattern = /(?<![\w-])(?:[a-z0-9/-]+:)*!?text-\[\d*\.?\d+(px|rem|em)\]/
		expect(offenders(pattern)).toEqual([])
	})

	it('puts page-wide layers on a named z-index', () => {
		const pattern = /(?<![\w-])(?:[a-z0-9/-]+:)*!?z-\[\d{3,}\]/
		expect(offenders(pattern)).toEqual([])
	})

	it('rounds corners from the radius scale', () => {
		const pattern =
			/(?<![\w-])(?:[a-z0-9/&>[\]-]+:)*!?rounded(-[tblrxyse]{1,2})?-(md|3xl|4xl|card|\[[^\]]+\])(?![\w-])/
		expect(offenders(pattern)).toEqual([])
	})

	it('writes the 4px radius as rounded-sm, never bare rounded', () => {
		const bare =
			/^(?:[a-z0-9/&>[\]-]+:)*!?rounded(-(?:tl|tr|bl|br|ss|se|es|ee|t|b|l|r|s|e))?!?$/
		const found = sourceFiles().flatMap((path) =>
			[...readFileSync(path, 'utf8').matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)]
				.flatMap((m) => (m[1] ?? m[2] ?? m[3]).split(/\s+/))
				.filter((token) => bare.test(token))
				.map((token) => `${path}: ${token}`)
		)
		expect(found).toEqual([])
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
			'src/features/widgets/bookmark/components/bookmark/bookmark-icon.tsx',
			'src/features/widgets/tools/pomodoro/top-users/components/top-user-item.tsx',
		]
		const allowed = ['src/common/toast.tsx', ...paintsContent]
		const bad = offenders(pattern).filter(
			(o) => !allowed.some((path) => o.startsWith(`${path}:`))
		)
		expect(bad).toEqual([])
	})
})

describe('white and black', () => {
	it('are written only where they depict something', () => {
		const alwaysDark = ['src/common/toast.tsx']
		const depictsBrands = [
			'src/features/setting/account/user-profile/connections/connections.tsx',
		]
		const awaitingDecision = ['src/components/ui/toggle/toggle.variants.ts']
		const allowed = [...alwaysDark, ...depictsBrands, ...awaitingDecision]
		const pattern =
			/(?<![\w-])(?:[a-z0-9/-]+:)*!?(bg|text|border|ring|from|to|via|fill|stroke|outline|divide|shadow|placeholder|decoration)-(white|black)(?![\w-])/
		const bad = offenders(pattern).filter(
			(o) => !allowed.some((path) => o.startsWith(`${path}:`))
		)
		expect(bad).toEqual([])
	})
})

describe('shared states', () => {
	it('spins only through Spinner or Icon spin', () => {
		const spinning = sourceFiles()
			.filter(
				(path) =>
					path !== 'src/components/ui/spinner/spinner.variants.ts' &&
					path !== 'src/icons/icon.tsx'
			)
			.filter((path) => readFileSync(path, 'utf8').includes('animate-spin'))
		expect(spinning).toEqual([])
	})

	it('draws a widget empty or error state with WidgetEmpty or WidgetError', () => {
		const own = sourceFiles()
			.filter((path) => path.startsWith('src/features/widgets/'))
			.filter((path) => !path.startsWith('src/features/widgets/components/'))
			.filter((path) => /-(empty|error)\.tsx$/.test(path))
			.filter((path) => !/<Widget(Empty|Error)\b/.test(readFileSync(path, 'utf8')))
		expect(own).toEqual([])
	})
})

describe('icons', () => {
	it('draws every icon from Lucide, apart from the brand logos', () => {
		const pack = readFileSync('src/icons/packs/default.tsx', 'utf8')
		const others = [...pack.matchAll(/import \{([^}]*)\} from 'react-icons\/(\w+)'/g)]
			.filter((m) => m[2] !== 'lu')
			.flatMap((m) => m[1].split(',').map((name) => name.trim()))
			.filter(Boolean)
			.sort()
		expect(others).toEqual(['BiLogoGoogle', 'FaTelegramPlane', 'FcGoogle'])
	})

	it('reaches react-icons only through Icon', () => {
		const outside = sourceFiles()
			.filter((path) => !path.startsWith('src/icons/'))
			.filter((path) => /from 'react-icons/.test(readFileSync(path, 'utf8')))
		expect(outside).toEqual([])
	})
})

describe('motion', () => {
	it('lets transition-ui animate the properties Tailwind moves elements with', () => {
		const utilities = readFileSync(join(STYLES, 'utilities.css'), 'utf8')
		const block = utilities.slice(utilities.indexOf('@utility transition-ui'))
		const properties = block.slice(block.indexOf(':') + 1, block.indexOf(';'))
		const listed = properties.split(',').map((p) => p.trim())
		expect(
			['translate', 'scale', 'rotate', 'transform', 'opacity'].filter(
				(p) => !listed.includes(p)
			)
		).toEqual([])
	})

	it('never transitions every property', () => {
		expect(offenders(/(?<![\w-])(?:[a-z0-9-]+:)*!?transition-all(?![\w-])/)).toEqual(
			[]
		)
	})

	it('times transitions from the duration steps', () => {
		const pattern =
			/(?<![\w-])(?:[a-z0-9-]+:)*!?duration-(?!(150|200|300|500|1000)(?![\w-]))[\w[\].]+/
		expect(offenders(pattern)).toEqual([])
	})
})

describe('elevation', () => {
	it('uses only the four shadow steps elevation.css defines', () => {
		const pattern =
			/(?<![\w-])(?:[a-z0-9/-]+:)*!?(shadow-(2xs|xs|2xl|inner)|elevation-[a-z]+)(?![\w-])/
		expect(offenders(pattern)).toEqual([])
	})
})

describe('stylesheets stay parseable on Chrome 109', () => {
	const ours = walk(STYLES, '.css').map((p) => ({
		path: p,
		css: readFileSync(p, 'utf8'),
	}))

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

describe('stylesheets define nothing dead', () => {
	it('defines only classes a component writes', () => {
		const written = new Set<string>()
		for (const path of sourceFiles()) {
			const source = readFileSync(path, 'utf8')
			for (const literal of source.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)) {
				const text = literal[1] ?? literal[2] ?? literal[3]
				for (const token of text.split(/[\s{}$]+/)) {
					written.add(token.split(':').at(-1)?.replace(/^!|!$/g, '') ?? '')
				}
			}
		}
		const unused: string[] = []
		for (const path of walk('src', '.css')) {
			const css = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
			for (const [, prelude] of css.matchAll(/([^{};]+)\{/g)) {
				const utility = prelude.match(/^\s*@utility\s+([\w-]+?)(-\*)?\s*$/)
				if (utility?.[2]) {
					const family = `${utility[1]}-`
					if (![...written].some((token) => token.startsWith(family)))
						unused.push(`${path.split(sep).join('/')}: .${family}*`)
					continue
				}
				const classes = utility
					? [utility[1]]
					: prelude.trim().startsWith('@')
						? []
						: [...prelude.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)].map((m) => m[1])
				for (const name of classes) {
					if (!written.has(name))
						unused.push(`${path.split(sep).join('/')}: .${name}`)
				}
			}
		}
		expect(unused).toEqual([])
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
			.map(([, name, value]) => [name, value.replace(/\s+/g, '')])
			.filter(
				([name, value]) =>
					!name.startsWith('--color-') ||
					!(
						value.startsWith('rgba(var(--color-') ||
						value.startsWith('var(--color-') ||
						drawnOverImage.test(name)
					)
			)
			.map(([name, value]) => `${name}: ${value}`)
		expect(bad).toEqual([])
	})

	it('names only colours that tokens.css or the theme declare', () => {
		const declared = [...tokens.matchAll(/^\s*--color-([a-z0-9-]+)\s*:/gm)].map(
			(m) => m[1]
		)
		const declaredByTheTheme = ['secondary', 'success', 'warning', 'info', 'vip']
		const vocabulary = new Set([...declared, ...declaredByTheTheme])
		const pattern =
			/(?<![\w-])(?:[a-z0-9/-]+:)*!?(?:bg|text|border(?:-[tblrxyse])?|ring(?:-offset)?|outline|from|to|via|divide|fill|stroke|shadow|placeholder|caret|accent|decoration)-(?:glass-)?((?:fg|surface|fill|line|on|brand|danger|success|warning|info|secondary|vip|image|scrim|primary|error|accent|neutral|widget|content|raised|subtle|hovered|strong|muted|faint|ghost|bold|over-image|medal|avatar|nav)(?:-[a-z0-9]+)*)!?(?![\w-])/g
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
	const tokens = readFileSync(join(STYLES, 'tokens.css'), 'utf8')
	const themeFiles = readdirSync(THEMES)
		.filter((f) => f.endsWith('.css'))
		.map((f) => ({
			name: f.replace('.css', ''),
			css: readFileSync(join(THEMES, f), 'utf8'),
		}))

	function pluginBlock(css: string): string {
		return css.slice(css.indexOf('{') + 1, css.indexOf('\n}'))
	}

	it('all declare the same variables, apart from glass and token overrides', () => {
		// The whole file, not just the @plugin block: the channel triples live
		// in a [data-theme] rule after it, and they are the half that breaks
		// silently when a theme forgets them.
		const sets = themeFiles.map((t) => ({
			name: t.name,
			vars: [...t.css.matchAll(/--([a-z0-9-]+)\s*:/g)]
				.map((m) => m[1])
				.filter((v) => !v.startsWith('glass-') && !tokens.includes(`--${v}:`))
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
			CHANNELS.filter((v) => !t.css.includes(`${v}:`)).map((v) => `${t.name}: ${v}`)
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

	it('hold only their daisyUI block and one block of variables', () => {
		const bad = themeFiles.flatMap((t) => {
			const nodes = topLevel(t.css.replace(/\/\*[\s\S]*?\*\//g, ''))
			const preludes = nodes.map((node) => node.prelude)
			const expected = ['@plugin "daisyui/theme"', `[data-theme="${t.name}"]`]
			if (preludes.join(' | ') !== expected.join(' | ')) {
				return [`${t.name}: ${preludes.join(' | ')}`]
			}
			const [plugin, variables] = nodes
			return [
				...(plugin.body?.includes(`name: "${t.name}";`)
					? []
					: [`${t.name}: plugin name`]),
				...(holdsOnlyVariables(variables.body ?? '')
					? []
					: [`${t.name}: a rule`]),
			]
		})
		expect(bad).toEqual([])
	})

	it('set outside the daisyUI block only channels, shadows, glass and tokens', () => {
		const tokenNames = new Set(
			[...tokens.matchAll(/^\s*(--color-[a-z0-9-]+)\s*:/gm)].map((m) => m[1])
		)
		const allowed = (name: string) =>
			/^--color-[a-z0-9-]+-(rgb|a)$/.test(name) ||
			/^--elevation-(sm|md|lg|xl)-color$/.test(name) ||
			/^--glass-(bg|filter|modal-bg|modal-filter)$/.test(name) ||
			tokenNames.has(name)
		const bad = themeFiles.flatMap((t) => {
			const block = topLevel(t.css.replace(/\/\*[\s\S]*?\*\//g, ''))[1]?.body ?? ''
			return [...declarationsOf(block).keys()]
				.filter((name) => !allowed(name))
				.map((name) => `${t.name}: ${name}`)
		})
		expect(bad).toEqual([])
	})

	it('split each colour into the channels it is written in', () => {
		const primitives = topLevel(
			readFileSync(join(STYLES, 'primitives.css'), 'utf8').replace(
				/\/\*[\s\S]*?\*\//g,
				''
			)
		)
		const constants = new Map(
			primitives.flatMap((node) => [...declarationsOf(node.body ?? '')])
		)
		const rgba = (value: string | undefined): number[] | null => {
			if (!value) return null
			const constant = value.match(/^var\((--[\w-]+)\)$/)
			if (constant) return rgba(constants.get(constant[1]))
			const hex = value.match(/^#([0-9a-f]{3,8})$/i)
			if (hex) {
				const full =
					hex[1].length <= 4 ? [...hex[1]].map((c) => c + c).join('') : hex[1]
				const [r, g, b, a] = (full.match(/../g) ?? []).map((pair) =>
					Number.parseInt(pair, 16)
				)
				return [r, g, b, a === undefined ? 1 : Math.round((a / 255) * 100) / 100]
			}
			const fn = value.match(/^rgba?\((.+)\)$/)
			if (!fn) return null
			const [r, g, b, a] = fn[1]
				.replace(/var\((--[\w-]+)\)/g, (_, name) => constants.get(name) ?? name)
				.split(',')
				.map((part) => Number(part.trim()))
			return [r, g, b, a ?? 1]
		}
		const sources = [
			{ name: 'primitives', colours: constants, channels: constants },
			...themeFiles.map((t) => {
				const [plugin, variables] = topLevel(
					t.css.replace(/\/\*[\s\S]*?\*\//g, '')
				)
				return {
					name: t.name,
					colours: declarationsOf(plugin?.body ?? ''),
					channels: declarationsOf(variables?.body ?? ''),
				}
			}),
		]
		const bad = sources.flatMap(({ name, colours, channels }) =>
			[...channels].flatMap(([variable, value]) => {
				const split = variable.match(/^(--[\w-]+)-(rgb|a)$/)
				if (!split || !colours.has(split[1])) return []
				const colour = rgba(colours.get(split[1]))
				if (!colour) return [`${name}: ${split[1]} cannot be read`]
				const expected =
					split[2] === 'rgb' ? colour.slice(0, 3).join(', ') : String(colour[3])
				const written =
					split[2] === 'rgb'
						? value
								.split(',')
								.map((part) => Number(part.trim()))
								.join(', ')
						: String(Number(value))
				return written === expected
					? []
					: [`${name}: ${variable} is ${written}, not ${expected}`]
			})
		)
		expect(bad).toEqual([])
	})
})

describe('every stylesheet has one role', () => {
	const ROLES: Record<string, RegExp> = {
		'index.css': /^@(import|plugin|source not) "/,
		'fonts.css': /^@font-face$/,
		'primitives.css': /^(@theme|:root)$/,
		'tokens.css': /^@theme$/,
		'elevation.css': /^(@theme|:root)$/,
		'animations.css': /^(@theme|@keyframes [\w-]+)$/,
		'base.css': /^@layer base$/,
		'utilities.css': /^@utility [\w-]+(-\*)?$/,
		'legacy.css': /^[^@]/,
	}

	it('holds in each file only what its role allows', () => {
		const bad = stylesheets()
			.filter(({ path }) => !path.startsWith(`${STYLES}/themes/`))
			.flatMap(({ path, css }) => {
				const role = path.startsWith(`${STYLES}/`)
					? ROLES[path.slice(STYLES.length + 1)]
					: undefined
				if (!role) return [`${path}: no role`]
				return topLevel(css)
					.filter((node) => !role.test(node.prelude))
					.map((node) => `${path}: ${node.prelude}`)
			})
		expect(bad).toEqual([])
	})

	it('keeps a :root block to variables', () => {
		const bad = stylesheets().flatMap(({ path, css }) =>
			topLevel(css)
				.filter(
					(node) =>
						node.prelude === ':root' && !holdsOnlyVariables(node.body ?? '')
				)
				.map(() => path)
		)
		expect(bad).toEqual([])
	})

	it('names a theme only inside its own file', () => {
		const bad = stylesheets()
			.filter(({ path }) => !path.startsWith(`${STYLES}/themes/`))
			.filter(({ css }) => css.includes('[data-theme'))
			.map(({ path }) => path)
		expect(bad).toEqual([])
	})

	it('writes @keyframes only in animations.css', () => {
		const bad = stylesheets()
			.filter(({ path }) => path !== `${STYLES}/animations.css`)
			.filter(({ css }) => css.includes('@keyframes'))
			.map(({ path }) => path)
		expect(bad).toEqual([])
	})

	it('writes a class only as an @utility, or as a state on html', () => {
		const bad = stylesheets()
			.filter(({ path }) => path !== `${STYLES}/legacy.css`)
			.flatMap(({ path, css }) =>
				[...css.matchAll(/([^{};]+)\{/g)]
					.map((m) => m[1].trim())
					.filter((prelude) => !prelude.startsWith('@'))
					.filter((prelude) =>
						/\.-?[A-Za-z_]/.test(prelude.replace(/html\.[\w-]+/g, 'html'))
					)
					.map((prelude) => `${path}: ${prelude}`)
			)
		expect(bad).toEqual([])
	})

	it('lets Tailwind read classes only from the app, not from docs or tests', () => {
		const entry = readFileSync(join(STYLES, 'index.css'), 'utf8')
		expect(entry.startsWith('@import "tailwindcss" source("../");')).toBe(true)
		expect(entry).toContain('@source not "../**/*.md";')
		expect(entry).toContain('@source not "../**/__tests__";')
	})

	it('reaches every stylesheet from styles/index.css, and main.tsx imports only that', () => {
		const entry = readFileSync(join(STYLES, 'index.css'), 'utf8')
		const imported = [...entry.matchAll(/@import "\.\/([^"]+)"/g)]
			.map((m) => `${STYLES}/${m[1]}`)
			.sort()
		const files = stylesheets()
			.map(({ path }) => path)
			.filter((path) => path !== `${STYLES}/index.css`)
			.sort()
		expect(imported).toEqual(files)
		const cssImports = sourceFiles().flatMap((path) =>
			[
				...readFileSync(path, 'utf8').matchAll(/import\s+['"]([^'"]+\.css)['"]/g),
			].map((m) => `${path}: ${m[1]}`)
		)
		expect(cssImports).toEqual(['src/main.tsx: @/styles/index.css'])
	})
})

describe('every var() resolves', () => {
	it('reads only variables a stylesheet, Tailwind or an inline style declares', () => {
		const declared = new Set<string>()
		const tailwind = readFileSync('node_modules/tailwindcss/theme.css', 'utf8')
		for (const css of [tailwind, ...stylesheets().map((s) => s.css)]) {
			for (const m of css.matchAll(/(--[\w-]+)\s*:/g)) declared.add(m[1])
		}
		for (const path of sourceFiles()) {
			for (const m of readFileSync(path, 'utf8').matchAll(
				/['"`](--[\w-]+)['"`]\s*[:,]/g
			)) {
				declared.add(m[1])
			}
		}
		const texts = [
			...sourceFiles().map((path) => ({ path, text: readFileSync(path, 'utf8') })),
			...stylesheets().map(({ path, css }) => ({ path, text: css })),
		]
		const bad = texts.flatMap(({ path, text }) =>
			[...text.matchAll(/var\(\s*(--[\w-]+)(\$\{)?/g)]
				.filter((m) => !m[2] && !m[1].startsWith('--tw-') && !declared.has(m[1]))
				.map((m) => `${path}: ${m[1]}`)
		)
		expect(bad).toEqual([])
	})
})

describe('typography', () => {
	it('pins controls through --tw-leading, the variable text sizes defer to', async () => {
		const base = readFileSync(join(STYLES, 'base.css'), 'utf8')
		expect(base).toContain('--tw-leading: var(--leading-control);')
		const compiler = await compile(
			'@theme { --text-sm: 0.875rem; --text-sm--line-height: 1.25rem; } @tailwind utilities;'
		)
		expect(compiler.build(['text-sm'])).toContain('line-height: var(--tw-leading,')
	})
})

interface WrittenClass {
	token: string
	at: string
}

interface ParsedFile {
	file: ts.SourceFile
	declared: Map<string, ts.Node[]>
	imported: Map<string, { from: string; name: string }>
}

const CLASS_CALLS = new Set(['cn', 'clsx', 'twJoin', 'twMerge'])
const HOLDS_CLASSES = /class(es|name)?$/i

function tokensOf(text: string, openStart: boolean, openEnd: boolean): string[] {
	const parts = text.split(/\s+/)
	return parts.filter(
		(part, i) =>
			part && !(i === 0 && openStart) && !(i === parts.length - 1 && openEnd)
	)
}

const parsedFiles = new Map<string, ParsedFile>()

function parsed(path: string): ParsedFile {
	const cached = parsedFiles.get(path)
	if (cached) return cached
	const file = ts.createSourceFile(
		path,
		readFileSync(path, 'utf8'),
		ts.ScriptTarget.Latest,
		true,
		path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
	)
	const declared = new Map<string, ts.Node[]>()
	const imported = new Map<string, { from: string; name: string }>()
	const remember = (name: string, node: ts.Node) =>
		declared.set(name, [...(declared.get(name) ?? []), node])
	const visit = (node: ts.Node) => {
		if (
			ts.isVariableDeclaration(node) &&
			ts.isIdentifier(node.name) &&
			node.initializer
		) {
			remember(node.name.text, node.initializer)
		} else if (ts.isFunctionDeclaration(node) && node.name) {
			remember(node.name.text, node)
		} else if (
			ts.isImportDeclaration(node) &&
			ts.isStringLiteral(node.moduleSpecifier) &&
			node.importClause?.namedBindings &&
			ts.isNamedImports(node.importClause.namedBindings)
		) {
			for (const element of node.importClause.namedBindings.elements) {
				imported.set(element.name.text, {
					from: node.moduleSpecifier.text,
					name: (element.propertyName ?? element.name).text,
				})
			}
		}
		ts.forEachChild(node, visit)
	}
	visit(file)
	const result = { file, declared, imported }
	parsedFiles.set(path, result)
	return result
}

function moduleFile(specifier: string, from: string): string | undefined {
	const base = specifier.startsWith('@/')
		? `src/${specifier.slice(2)}`
		: specifier.startsWith('.')
			? join(dirname(from), specifier).split(sep).join('/')
			: undefined
	if (!base) return undefined
	return [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((path) => {
		try {
			return statSync(path).isFile()
		} catch {
			return false
		}
	})
}

function definitionsOf(name: string, path: string): ts.Node[] {
	const { declared, imported } = parsed(path)
	const local = declared.get(name)
	if (local) return local
	const source = imported.get(name)
	if (!source) return []
	const target = moduleFile(source.from, path)
	return target ? (parsed(target).declared.get(source.name) ?? []) : []
}

function isFunctionLike(node: ts.Node): node is ts.FunctionLikeDeclaration {
	return (
		ts.isFunctionDeclaration(node) ||
		ts.isArrowFunction(node) ||
		ts.isFunctionExpression(node)
	)
}

function returnedValues(fn: ts.FunctionLikeDeclaration): ts.Node[] {
	if (fn.body && !ts.isBlock(fn.body)) return [fn.body]
	const values: ts.Node[] = []
	const visit = (node: ts.Node) => {
		if (isFunctionLike(node)) return
		if (ts.isReturnStatement(node) && node.expression) values.push(node.expression)
		ts.forEachChild(node, visit)
	}
	if (fn.body) ts.forEachChild(fn.body, visit)
	return values
}

function writtenClasses(): WrittenClass[] {
	const found: WrittenClass[] = []
	const seen = new Set<ts.Node>()

	const add = (text: string, node: ts.Node, openStart = false, openEnd = false) => {
		const file = node.getSourceFile()
		const line = file.getLineAndCharacterOfPosition(node.getStart()).line + 1
		for (const token of tokensOf(text, openStart, openEnd)) {
			found.push({ token, at: `${file.fileName}:${line}` })
		}
	}

	const fromValue = (node: ts.Node, keysAreClasses: boolean): void => {
		if (seen.has(node)) return
		seen.add(node)
		const path = node.getSourceFile().fileName
		if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
			add(node.text, node)
		} else if (ts.isTemplateExpression(node)) {
			const pieces = [node.head, ...node.templateSpans.map((span) => span.literal)]
			pieces.forEach((piece, i) => {
				add(
					piece.text,
					node,
					i > 0 && !/^\s/.test(piece.text),
					i < pieces.length - 1 && !/\s$/.test(piece.text)
				)
			})
			for (const span of node.templateSpans)
				fromValue(span.expression, keysAreClasses)
		} else if (ts.isConditionalExpression(node)) {
			fromValue(node.whenTrue, keysAreClasses)
			fromValue(node.whenFalse, keysAreClasses)
		} else if (ts.isBinaryExpression(node)) {
			const operator = node.operatorToken.kind
			if (operator === ts.SyntaxKind.AmpersandAmpersandToken) {
				fromValue(node.right, keysAreClasses)
			} else if (
				operator === ts.SyntaxKind.BarBarToken ||
				operator === ts.SyntaxKind.QuestionQuestionToken
			) {
				fromValue(node.left, keysAreClasses)
				fromValue(node.right, keysAreClasses)
			}
		} else if (
			ts.isParenthesizedExpression(node) ||
			ts.isJsxExpression(node) ||
			ts.isAsExpression(node)
		) {
			if (node.expression) fromValue(node.expression, keysAreClasses)
		} else if (ts.isArrayLiteralExpression(node)) {
			for (const element of node.elements) fromValue(element, keysAreClasses)
		} else if (ts.isObjectLiteralExpression(node)) {
			for (const property of node.properties) {
				if (!ts.isPropertyAssignment(property)) continue
				if (!keysAreClasses) fromValue(property.initializer, false)
				else if (
					ts.isStringLiteral(property.name) ||
					ts.isIdentifier(property.name)
				)
					add(property.name.text, property)
			}
		} else if (ts.isIdentifier(node)) {
			for (const definition of definitionsOf(node.text, path)) {
				if (!isFunctionLike(definition)) fromValue(definition, keysAreClasses)
			}
		} else if (ts.isElementAccessExpression(node)) {
			fromValue(node.expression, false)
		} else if (
			ts.isPropertyAccessExpression(node) &&
			ts.isIdentifier(node.expression)
		) {
			for (const definition of definitionsOf(node.expression.text, path)) {
				if (!ts.isObjectLiteralExpression(definition)) continue
				for (const property of definition.properties) {
					if (
						ts.isPropertyAssignment(property) &&
						property.name.getText() === node.name.text
					) {
						fromValue(property.initializer, false)
					}
				}
			}
		} else if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
			if (CLASS_CALLS.has(node.expression.text)) {
				for (const argument of node.arguments) fromValue(argument, true)
			} else {
				for (const definition of definitionsOf(node.expression.text, path)) {
					if (isFunctionLike(definition)) {
						for (const value of returnedValues(definition))
							fromValue(value, false)
					}
				}
			}
		}
	}

	const fromCva = (call: ts.CallExpression) => {
		const [base, config] = call.arguments
		if (base) fromValue(base, false)
		if (!config || !ts.isObjectLiteralExpression(config)) return
		for (const property of config.properties) {
			if (!ts.isPropertyAssignment(property)) continue
			const key = property.name.getText()
			if (
				key === 'variants' &&
				ts.isObjectLiteralExpression(property.initializer)
			) {
				for (const variant of property.initializer.properties) {
					if (
						ts.isPropertyAssignment(variant) &&
						ts.isObjectLiteralExpression(variant.initializer)
					) {
						fromValue(variant.initializer, false)
					}
				}
			}
			if (
				key === 'compoundVariants' &&
				ts.isArrayLiteralExpression(property.initializer)
			) {
				for (const entry of property.initializer.elements) {
					if (!ts.isObjectLiteralExpression(entry)) continue
					for (const part of entry.properties) {
						if (
							ts.isPropertyAssignment(part) &&
							/^(class|className)$/.test(part.name.getText())
						) {
							fromValue(part.initializer, false)
						}
					}
				}
			}
		}
	}

	for (const path of sourceFiles()) {
		const visit = (node: ts.Node) => {
			if (
				ts.isJsxAttribute(node) &&
				HOLDS_CLASSES.test(node.name.getText()) &&
				node.initializer
			) {
				fromValue(node.initializer, true)
				return
			}
			if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
				if (node.expression.text === 'cva') {
					fromCva(node)
					return
				}
				if (CLASS_CALLS.has(node.expression.text)) {
					fromValue(node, true)
					return
				}
			}
			if (
				(ts.isVariableDeclaration(node) || ts.isPropertyAssignment(node)) &&
				node.initializer &&
				HOLDS_CLASSES.test(node.name.getText())
			) {
				fromValue(node.initializer, false)
				return
			}
			ts.forEachChild(node, visit)
		}
		visit(parsed(path).file)
	}
	return found
}

const DAISY_COLOURS = [
	...[
		'primary',
		'secondary',
		'accent',
		'neutral',
		'info',
		'success',
		'warning',
		'error',
	].flatMap((name) => [name, `${name}-content`]),
	'base-100',
	'base-200',
	'base-300',
	'base-content',
]

async function stylesheetFor(candidates: string[], withDaisy: boolean): Promise<string> {
	const strip = (css: string) =>
		withDaisy ? css : css.replace(/@plugin\s+"daisyui[^"]*"\s*(\{[^}]*\})?;?/g, '')
	const colourStandIns = withDaisy
		? ''
		: `@theme { ${DAISY_COLOURS.map((name) => `--color-${name}: #000;`).join(' ')} }`
	const entry = strip(readFileSync(join(STYLES, 'index.css'), 'utf8')) + colourStandIns
	const compiler = await compile(entry, {
		base: resolve(STYLES),
		loadStylesheet: async (id, base) => {
			const path =
				id === 'tailwindcss'
					? resolve('node_modules/tailwindcss/index.css')
					: resolve(base, id)
			return {
				path,
				base: dirname(path),
				content: strip(readFileSync(path, 'utf8')),
			}
		},
		loadModule: async (id, base) => {
			const module = await import(id)
			return { path: id, base, module: module.default ?? module }
		},
	})
	return compiler.build(candidates)
}

function selectorOf(token: string): string {
	let escaped = ''
	for (let i = 0; i < token.length; i++) {
		const char = token[i]
		const code = token.charCodeAt(i)
		if (i === 0 && code >= 0x30 && code <= 0x39) escaped += `\\${code.toString(16)} `
		else if (/[\w-]/.test(char) || code >= 0x80) escaped += char
		else escaped += `\\${char}`
	}
	return `.${escaped}`
}

describe('classes', () => {
	const written = writtenClasses()
	const candidates = [...new Set(written.map((w) => w.token))]
	let full = ''
	let bare = ''

	beforeAll(async () => {
		full = await stylesheetFor(candidates, true)
		bare = await stylesheetFor(candidates, false)
	})

	const compiles = (token: string, css: string) => css.includes(selectorOf(token))
	const isMarker = (token: string) => /^(group|peer)(\/[\w-]+)?$/.test(token)

	it('are only ones that compile to CSS', () => {
		const dead = written
			.filter(({ token }) => !isMarker(token) && !compiles(token, full))
			.map(({ token, at }) => `${at} ${token}`)
		expect(dead).toEqual([])
	})

	it('reach daisyUI components only inside components/ui', () => {
		const placeholder = 'skeleton'
		const awaitingAComponent: Record<string, string> = {
			alert: 'src/features/setting/account/auth-form/auth-form.tsx',
			'alert-warning': 'src/features/setting/account/auth-form/auth-form.tsx',
			select: 'src/features/setting/general/components/timezone-settings.tsx',
		}
		const outside = written
			.filter(({ at }) => !at.startsWith('src/components/ui/'))
			.filter(({ token }) => token !== placeholder)
			.filter(({ token }) => compiles(token, full) && !compiles(token, bare))
			.filter(({ token, at }) => !at.startsWith(`${awaitingAComponent[token]}:`))
			.map(({ token, at }) => `${at} ${token}`)
		expect(outside).toEqual([])
	})

	it('put the important mark at the end, never at the front', () => {
		const front = written
			.filter(({ token }) => /^(?:[\w/[\]-]+:)*!/.test(token))
			.map(({ token, at }) => `${at} ${token}`)
		expect(front).toEqual([])
	})
})
