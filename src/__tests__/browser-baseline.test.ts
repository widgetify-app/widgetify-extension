import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const CHROME = 109
const FIREFOX = 115

interface Newer {
	feature: string
	pattern: RegExp
	arrivedIn: string
}

const NEWER_THAN_THE_BASELINE: Newer[] = [
	{ feature: 'Array toSorted', pattern: /\.toSorted\(/, arrivedIn: 'Chrome 110' },
	{ feature: 'Array toReversed', pattern: /\.toReversed\(/, arrivedIn: 'Chrome 110' },
	{ feature: 'Array toSpliced', pattern: /\.toSpliced\(/, arrivedIn: 'Chrome 110' },
	{
		feature: 'Object.groupBy and Map.groupBy',
		pattern: /\b(Object|Map)\.groupBy\(/,
		arrivedIn: 'Chrome 117, Firefox 119',
	},
	{
		feature: 'Promise.withResolvers',
		pattern: /Promise\.withResolvers\(/,
		arrivedIn: 'Chrome 119, Firefox 121',
	},
	{
		feature: 'Array.fromAsync',
		pattern: /Array\.fromAsync\(/,
		arrivedIn: 'Chrome 121',
	},
	{
		feature: 'Set union, intersection and the other new methods',
		pattern:
			/\.(union|intersection|difference|symmetricDifference|isSubsetOf|isSupersetOf|isDisjointFrom)\(/,
		arrivedIn: 'Chrome 122, Firefox 127',
	},
	{
		feature: 'AbortSignal.any',
		pattern: /AbortSignal\.any\(/,
		arrivedIn: 'Chrome 116, Firefox 124',
	},
	{ feature: 'URL.canParse', pattern: /URL\.canParse\(/, arrivedIn: 'Chrome 120' },
	{ feature: 'Intl.Segmenter', pattern: /Intl\.Segmenter/, arrivedIn: 'Firefox 125' },
	{
		feature: 'document.startViewTransition',
		pattern: /startViewTransition/,
		arrivedIn: 'Chrome 111',
	},
	{
		feature: 'the popover attribute',
		pattern: /\bpopover(target)?=/,
		arrivedIn: 'Chrome 114, Firefox 125',
	},
	{
		feature: 'CSS :has() and the has-[] variant',
		pattern: /:has\(|(^|[\s"'`:])has-\[/,
		arrivedIn: 'Firefox 121',
	},
	{ feature: 'CSS subgrid', pattern: /subgrid/, arrivedIn: 'Chrome 117' },
	{
		feature: 'CSS anchor positioning',
		pattern: /anchor-name|position-anchor/,
		arrivedIn: 'Chrome 125',
	},
	{ feature: 'CSS @scope', pattern: /@scope\b/, arrivedIn: 'Chrome 118' },
]

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name)
		if (statSync(path).isDirectory()) return name === '__tests__' ? [] : walk(path)
		return [path.split('\\').join('/')]
	})
}

function sourceFiles(): string[] {
	return ['src', 'entrypoints', 'background']
		.flatMap(walk)
		.filter((path) => /\.(tsx?|css)$/.test(path))
}

describe('the oldest browsers we support', () => {
	it(`use nothing that Chrome ${CHROME} or Firefox ${FIREFOX} do not have`, () => {
		const found = sourceFiles().flatMap((path) =>
			readFileSync(path, 'utf8')
				.split('\n')
				.flatMap((line, index) =>
					NEWER_THAN_THE_BASELINE.filter(({ pattern }) =>
						pattern.test(line)
					).map(
						({ feature, arrivedIn }) =>
							`${path}:${index + 1} ${feature} (arrived in ${arrivedIn})`
					)
				)
		)
		expect(found).toEqual([])
	})

	it(`ask Firefox for no more than ${FIREFOX} in the manifest`, () => {
		const config = readFileSync('wxt.config.ts', 'utf8')
		const declared = [
			...config.matchAll(/strict_min_version:\s*'(\d+)(?:\.\d+)?'/g),
		].map((match) => Number(match[1]))
		expect(declared.length).toBeGreaterThan(0)
		expect(declared.filter((version) => version > FIREFOX)).toEqual([])
	})
})
