import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'

const COMMENT_BASELINE: Record<string, number> = {
	'background/cache-config.ts': 2,
	'background/cache.ts': 9,
	'background/wallpaper-cache.ts': 4,
	'src/common/types/wallpaper.interface.ts': 2,
	'src/common/utils/call-event.ts': 2,
	'src/common/utils/date-events.ts': 3,
	'src/common/utils/translate-error.ts': 12,
	'src/components/ui/input/input.variants.ts': 1,
	'src/components/ui/tabs/tabs.variants.ts': 2,
	'src/components/ui/tooltip/tooltip.tsx': 3,
	'src/context/general-setting.context.tsx': 7,
	'src/context/utils/reduced-motion.ts': 1,
	'src/features/explorer/components/explorer-popover-menu.tsx': 2,
	'src/features/explorer/components/promo-modal.tsx': 1,
	'src/features/friends/components/activity-card/empty-activity-card.tsx': 2,
	'src/features/friends/components/add-friend-bottom-sheet.tsx': 1,
	'src/features/mini-apps/components/mini-app-runner.tsx': 2,
	'src/features/setting/about-us/about-us.tsx': 1,
	'src/features/setting/shortcuts/shortcuts.tsx': 1,
	'src/features/setting/vip/vip.tsx': 1,
	'src/features/widgets/bookmark/bookmark.context.tsx': 1,
	'src/features/widgets/bookmark/components/modal/advanced-modal.tsx': 1,
	'src/features/widgets/clock/variants/clock-analog.tsx': 9,
	'src/features/widgets/clock/variants/clock-flip.tsx': 1,
	'src/features/widgets/google-calendar/hooks/use-google-calendar-schedule.ts': 1,
	'src/features/widgets/utils/browser-bookmarks.ts': 7,
	'src/features/widgets/utils/icon.ts': 1,
	'src/features/widgets/utils/migration.ts': 3,
	'src/services/auth/auth-service.hook.ts': 1,
	'src/services/date/get-events.hook.ts': 1,
	'src/services/friends/friend-service.hook.ts': 2,
	'src/services/mood-log/get-moods.hook.ts': 1,
	'src/services/mood-log/upsert-mood-log.hook.ts': 1,
	'src/services/timezone/get-timezones.hook.ts': 1,
	'src/services/user/user-service.hook.ts': 1,
}

const NAMES_THE_RULE = ['src/__tests__/hygiene.test.ts', 'scripts/check-commit.mjs']
const WHO_WROTE_IT =
	/\b(claude|anthropic|co-authored-by|generated with|chatgpt|openai|copilot)\b/i
const TEXT_FILE = /\.(tsx?|css|md|json|mjs|html)$/
const ROOT_FILES = [
	'README.md',
	'package.json',
	'wxt.config.ts',
	'biome.json',
	'tsconfig.json',
]
const DIRECTIVE = /^\/\/\s*@ts-(expect-error|ignore|nocheck)|^\/\/\/\s*<reference/

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name)
		if (statSync(path).isDirectory()) return walk(path)
		return [path.split('\\').join('/')]
	})
}

function repoText(): string[] {
	return [
		...['src', 'entrypoints', 'background', 'scripts', '.github'].flatMap(walk),
		...ROOT_FILES,
	].filter((path) => TEXT_FILE.test(path) && !NAMES_THE_RULE.includes(path))
}

function codeFiles(): string[] {
	return ['src', 'entrypoints', 'background']
		.flatMap(walk)
		.filter(
			(path) =>
				/\.tsx?$/.test(path) &&
				!path.endsWith('.d.ts') &&
				!path.includes('__tests__')
		)
}

function commentCount(path: string): number {
	const text = readFileSync(path, 'utf8')
	if (!text.includes('//') && !text.includes('/*')) return 0
	const source = ts.createSourceFile(
		path,
		text,
		ts.ScriptTarget.Latest,
		true,
		path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
	)
	const seen = new Map<number, ts.CommentRange>()
	const visit = (node: ts.Node) => {
		for (const range of ts.getLeadingCommentRanges(text, node.getFullStart()) ?? []) {
			seen.set(range.pos, range)
		}
		for (const range of ts.getTrailingCommentRanges(text, node.getEnd()) ?? []) {
			seen.set(range.pos, range)
		}
		ts.forEachChild(node, visit)
	}
	visit(source)

	const real = [...seen.values()].filter(
		(range) => !DIRECTIVE.test(text.slice(range.pos, range.end))
	).length
	const inJsx = path.endsWith('x')
		? (text.match(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g) ?? []).length
		: 0
	return real + inJsx
}

describe('who wrote it', () => {
	it('leaves no assistant or tool name in the code, the docs or the config', () => {
		const found = repoText().flatMap((path) =>
			readFileSync(path, 'utf8')
				.split('\n')
				.flatMap((line, index) =>
					WHO_WROTE_IT.test(line) ? [`${path}:${index + 1}`] : []
				)
		)
		expect(found).toEqual([])
	})
})

describe('comments', () => {
	it('are not added, and the baseline stays exact', () => {
		const files = codeFiles()
		const changed = files
			.map((path) => ({
				path,
				count: commentCount(path),
				listed: COMMENT_BASELINE[path] ?? 0,
			}))
			.filter(({ count, listed }) => count !== listed)
			.map(
				({ path, count, listed }) =>
					`${path}: ${count} comments, the baseline says ${listed}`
			)
		const gone = Object.keys(COMMENT_BASELINE)
			.filter((path) => !files.includes(path))
			.map((path) => `${path}: in the baseline, but the file is gone`)
		expect([...changed, ...gone]).toEqual([])
	})
})

describe('console', () => {
	it('is not written to outside analytics.ts', () => {
		const found = codeFiles()
			.filter((path) => path !== 'src/analytics.ts')
			.flatMap((path) =>
				readFileSync(path, 'utf8')
					.split('\n')
					.flatMap((line, index) =>
						/\bconsole\.(log|info|debug)\(/.test(line)
							? [`${path}:${index + 1}`]
							: []
					)
			)
		expect(found).toEqual([])
	})
})
