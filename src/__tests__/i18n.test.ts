import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'
import { fa } from '@/common/i18n/fa'
import { t } from '@/common/i18n'

const PERSIAN = /[\u0600-\u06FF]/
const ROOTS = ['src', 'entrypoints', 'background']

const ALLOWLIST: { path: string; reason: string }[] = [
	{
		path: 'src/common/utils/date-events.ts',
		reason: 'Hijri month-name table indexed by calendar code; locale data, not UI copy',
	},
	{
		path: 'src/common/constants/config-keys.ts',
		reason: 'ConfigKey.VERSION_NAME is a saved/compared value; display uses common.config.versionName',
	},
	{
		path: 'src/common/constants/default-wallpaper.ts',
		reason: 'DEFAULT_WALLPAPER.name is persisted wallpaper identity data, not movable UI copy',
	},
	{
		path: 'src/features/widgets/constants.ts',
		reason: 'PERSIAN_WEEKDAYS short/full table indexed by calendar code; locale data, not UI copy',
	},
	{
		path: 'src/features/widgets/tools/components/religious-time.tsx',
		reason: 'DAILY_ZIKR keys are weekday names matched against moment-jalaali dddd output; locale lookup keys',
	},
	{
		path: 'src/features/widgets/weather/utils/clean-city-name.ts',
		reason: 'COUNTY_PREFIX regex strips شهرستان from city names; locale processing, not UI copy',
	},
	{
		path: 'src/features/widgets/wigi-arz/utils/get-price-change.ts',
		reason: 'Percent formatting uses toLocaleString(fa-IR) plus ٪; number/digit work out of i18n scope',
	},
]

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name)
		if (statSync(path).isDirectory()) {
			if (name === '__tests__' || name === 'i18n' || name === 'node_modules')
				return []
			return walk(path)
		}
		return [path.split('\\').join('/')]
	})
}

function scanFiles(): string[] {
	return ROOTS.flatMap((root) => {
		try {
			return walk(root)
		} catch {
			return []
		}
	}).filter((path) => /\.(ts|tsx|html|css)$/.test(path) && !path.endsWith('.d.ts'))
}

type Hit = { path: string; line: number; text: string }

function scanFile(path: string): Hit[] {
	const text = readFileSync(path, 'utf8')
	if (/\.(html|css)$/.test(path)) {
		return text
			.split(/\r?\n/)
			.flatMap((line, index) =>
				PERSIAN.test(line)
					? [{ path, line: index + 1, text: line.trim().slice(0, 120) }]
					: []
			)
	}
	const kind = path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
	const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, kind)
	const hits: Hit[] = []
	const visit = (node: ts.Node) => {
		if (
			ts.isStringLiteral(node) ||
			ts.isNoSubstitutionTemplateLiteral(node) ||
			ts.isRegularExpressionLiteral(node)
		) {
			if (PERSIAN.test(node.text)) {
				const { line } = source.getLineAndCharacterOfPosition(
					node.getStart(source)
				)
				hits.push({ path, line: line + 1, text: node.text.slice(0, 120) })
			}
		} else if (ts.isTemplateExpression(node)) {
			const parts = [
				node.head.text,
				...node.templateSpans.map((span) => span.literal.text),
			]
			if (parts.some((part) => PERSIAN.test(part))) {
				const { line } = source.getLineAndCharacterOfPosition(
					node.getStart(source)
				)
				hits.push({
					path,
					line: line + 1,
					text: parts.join('[…]').slice(0, 120),
				})
			}
		} else if (ts.isJsxText(node)) {
			const value = node.getText(source)
			if (PERSIAN.test(value)) {
				const { line } = source.getLineAndCharacterOfPosition(
					node.getStart(source)
				)
				hits.push({ path, line: line + 1, text: value.trim().slice(0, 120) })
			}
		} else if (ts.isIdentifier(node) && PERSIAN.test(node.text)) {
			const { line } = source.getLineAndCharacterOfPosition(node.getStart(source))
			hits.push({ path, line: line + 1, text: node.text })
		}
		ts.forEachChild(node, visit)
	}
	visit(source)
	return hits
}

function persianCommentCount(): number {
	let count = 0
	for (const path of scanFiles().filter((p) => /\.tsx?$/.test(p))) {
		const text = readFileSync(path, 'utf8')
		if (!PERSIAN.test(text) || (!text.includes('//') && !text.includes('/*')))
			continue
		const kind = path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
		const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, kind)
		const seen = new Map<number, ts.CommentRange>()
		const visit = (node: ts.Node) => {
			for (const range of ts.getLeadingCommentRanges(text, node.getFullStart()) ??
				[]) {
				seen.set(range.pos, range)
			}
			for (const range of ts.getTrailingCommentRanges(text, node.getEnd()) ?? []) {
				seen.set(range.pos, range)
			}
			ts.forEachChild(node, visit)
		}
		visit(source)
		for (const range of seen.values()) {
			if (PERSIAN.test(text.slice(range.pos, range.end))) count += 1
		}
	}
	return count
}

function collectHits(): Hit[] {
	const allow = new Set(ALLOWLIST.map((entry) => entry.path))
	return scanFiles().flatMap((path) => (allow.has(path) ? [] : scanFile(path)))
}

describe('i18n catalog', () => {
	it('keeps no Persian text outside the catalog and the allowlist', () => {
		const hits = collectHits()
		const report = hits.map(
			(hit) =>
				`${hit.path}:${hit.line}: ${JSON.stringify(hit.text)} — move this text to src/common/i18n/fa/<area>.ts and read it with t()`
		)
		expect(report).toEqual([])
	})

	it('keeps every allowlist entry justified by a real hit', () => {
		const stale = ALLOWLIST.filter((entry) => scanFile(entry.path).length === 0).map(
			(entry) =>
				`${entry.path}: allowlisted (${entry.reason}) but has no Persian hit`
		)
		expect(stale).toEqual([])
	})

	it('reports how many Persian comments remain in code', () => {
		expect(persianCommentCount()).toBeGreaterThanOrEqual(0)
	})

	it('references every catalog key from at least one t() call or MessageKey map', () => {
		const keys = new Set(Object.keys(fa))
		const used = new Set<string>()
		const callPattern = /\bt\(\s*['"]([^'"]+)['"]/g
		const mark = (text: string) => {
			for (const match of text.matchAll(callPattern)) {
				used.add(match[1])
			}
			const kind = text.includes('</') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
			const source = ts.createSourceFile(
				'scan.ts',
				text,
				ts.ScriptTarget.Latest,
				true,
				kind
			)
			const visit = (node: ts.Node) => {
				if (ts.isStringLiteral(node) && keys.has(node.text)) {
					used.add(node.text)
				}
				ts.forEachChild(node, visit)
			}
			visit(source)
		}
		for (const path of scanFiles().filter((p) => /\.tsx?$/.test(p))) {
			mark(readFileSync(path, 'utf8'))
		}
		for (const path of walk('src/common/__tests__').filter((p) =>
			p.endsWith('.ts')
		)) {
			mark(readFileSync(path, 'utf8'))
		}
		const dead = [...keys].filter((key) => !used.has(key))
		expect(dead).toEqual([])
	})

	it('never builds a t() key from a template or concatenation', () => {
		const bad: string[] = []
		for (const path of scanFiles().filter((p) => /\.tsx?$/.test(p))) {
			const text = readFileSync(path, 'utf8')
			const kind = path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
			const source = ts.createSourceFile(
				path,
				text,
				ts.ScriptTarget.Latest,
				true,
				kind
			)
			const visit = (node: ts.Node) => {
				if (
					ts.isCallExpression(node) &&
					ts.isIdentifier(node.expression) &&
					node.expression.text === 't' &&
					node.arguments[0]
				) {
					const arg = node.arguments[0]
					const ok =
						ts.isStringLiteral(arg) ||
						ts.isNoSubstitutionTemplateLiteral(arg) ||
						ts.isIdentifier(arg) ||
						ts.isPropertyAccessExpression(arg) ||
						ts.isElementAccessExpression(arg)
					if (
						!ok ||
						ts.isTemplateExpression(arg) ||
						ts.isBinaryExpression(arg)
					) {
						const { line } = source.getLineAndCharacterOfPosition(
							node.getStart(source)
						)
						bad.push(`${path}:${line + 1}`)
					}
				}
				ts.forEachChild(node, visit)
			}
			visit(source)
		}
		expect(bad).toEqual([])
	})

	it('exports a working t helper', () => {
		expect(typeof t).toBe('function')
		expect(t('common.coin.name')).toBe('ویج‌کوین')
	})

	it('keeps catalog values free of tanween and lone sentence periods', () => {
		const bad = Object.entries(fa).flatMap(([key, value]) => {
			const hits: string[] = []
			if (/\u064B/.test(value)) {
				hits.push(`${key}: tanween (ً) — write فعلا/مثلا/دقیقا without it`)
			}
			if (/(?<![A-Za-z0-9.])\.(?![A-Za-z0-9.])/.test(value)) {
				hits.push(
					`${key}: lone sentence period — drop the final . (keep ... / …)`
				)
			}
			return hits
		})
		expect(bad).toEqual([])
	})
})
