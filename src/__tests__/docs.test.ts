import { describe, expect, it } from 'bun:test'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, normalize } from 'node:path'

const SECTION_READMES = [
	'README.md',
	'src/README.md',
	'src/common/README.md',
	'src/components/README.md',
	'src/components/ui/README.md',
	'src/context/README.md',
	'src/features/README.md',
	'src/features/widgets/README.md',
	'src/hooks/README.md',
	'src/icons/README.md',
	'src/pages/README.md',
	'src/services/README.md',
	'src/styles/README.md',
	'entrypoints/README.md',
]

const OTHER_DOCS = [
	'AGENTS.md',
	'src/styles/themes/HOW_TO_ADD_THEME.md',
	'.github/CONTRIBUTING.md',
	'.github/CONTRIBUTING.fa.md',
	'.github/Api-doc.md',
	'.github/Api-doc.fa.md',
]

const UNCHECKED_DOCS = ['AGENTS.local.md']

const WIDGET_README = /^src\/features\/widgets\/[a-z0-9-]+\/README\.md$/
const LONG_READMES: Record<string, number> = {
	'AGENTS.md': 200,
	'src/styles/README.md': 320,
	'src/styles/themes/HOW_TO_ADD_THEME.md': 160,
	'.github/Api-doc.md': 400,
	'.github/Api-doc.fa.md': 400,
}
const LONG_WIDGET_README = 320
const DEFAULT_LIMIT = 120
const API_DOCS = ['.github/Api-doc.md', '.github/Api-doc.fa.md']
const REQUEST_CALL =
	/\b(?:client|api|axios|\w*Client\(\))\s*\.\s*(get|post|put|patch|delete)\s*(?:<(?:[^<>]|<[^<>]*>)*>)?\s*\(\s*([`'"])((?:(?!\2).)*)\2/gs
const TABLE_ENDPOINT =
	/^\| `(GET|POST|PUT|PATCH|DELETE) (\/[^`]*)` \| (?:yes|no|بله|خیر) \|/gm
const FILE_NAME = /\.(tsx?|css|md|mjs|json)$/
const NOT_A_PATH = /[*<>{}$\s()]/

function isSkipped(folder: string): boolean {
	return folder === 'node_modules' || (folder.startsWith('.') && folder !== '.github')
}

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name)
		if (statSync(path).isDirectory()) return isSkipped(name) ? [] : walk(path)
		return [path.split('\\').join('/')]
	})
}

const everyFile = walk('.')
const everyName = new Set(everyFile.map((path) => path.split('/').pop()))
const markdown = everyFile.filter((path) => path.endsWith('.md'))
const widgetReadmes = markdown.filter((path) => WIDGET_README.test(path))
const readDocs = [...SECTION_READMES, ...OTHER_DOCS, ...widgetReadmes].filter((path) =>
	existsSync(path)
)

function exists(token: string, from: string): boolean {
	const clean = token.replace(/^\.\//, '').replace(/:\d+$/, '')
	if (!clean.includes('/')) return everyName.has(clean)
	return [dirname(from), 'src', '.'].some((base) =>
		existsSync(normalize(join(base, clean)))
	)
}

function referencedFiles(path: string): string[] {
	const text = readFileSync(path, 'utf8')
	return [...text.matchAll(/`([^`\n]+)`/g)]
		.map((match) => match[1])
		.filter(
			(token) =>
				FILE_NAME.test(token) &&
				!NOT_A_PATH.test(token) &&
				!/^\.[\w.-]*\.(tsx?|css|md|mjs|json)$/.test(token) &&
				!/^\.(tsx?|css|md|mjs|json)$/.test(token) &&
				!token.startsWith('http')
		)
		.filter((token) => !exists(token, path))
}

function brokenLinks(path: string): string[] {
	const text = readFileSync(path, 'utf8')
	return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
		.map((match) => match[1])
		.filter((target) => !/^(https?:|mailto:|#)/.test(target))
		.map((target) => target.split('#')[0])
		.filter((target) => target && !existsSync(normalize(join(dirname(path), target))))
}

function endpointSegments(path: string): string {
	const clean = path.replace(/^\$\{API_URL\}/, '').split('?')[0]
	const segments = clean
		.replace(/\$\{[^}]*\}|\{[^}]*\}/g, '{x}')
		.split('/')
		.filter(Boolean)
	return `/${segments.join('/')}`
}

function calledEndpoints(): string[] {
	const found = walk('src/services')
		.filter((path) => path.endsWith('.ts'))
		.flatMap((path) =>
			[...readFileSync(path, 'utf8').matchAll(REQUEST_CALL)].map(
				(match) => `${match[1].toUpperCase()} ${endpointSegments(match[3])}`
			)
		)
	return [...new Set(found)]
}

function documentedEndpoints(path: string): string[] {
	return [...readFileSync(path, 'utf8').matchAll(TABLE_ENDPOINT)].map(
		(match) => `${match[1]} ${endpointSegments(match[2])}`
	)
}

function sameEndpoint(called: string, documented: string): boolean {
	const [calledMethod, calledPath] = called.split(' ')
	const [documentedMethod, documentedPath] = documented.split(' ')
	if (calledMethod !== documentedMethod) return false

	const calledSegments = calledPath.split('/')
	const documentedSegments = documentedPath.split('/')
	return (
		calledSegments.length === documentedSegments.length &&
		calledSegments.every(
			(segment, index) => segment === '{x}' || segment === documentedSegments[index]
		)
	)
}

describe('docs', () => {
	it('give every section a README', () => {
		expect(SECTION_READMES.filter((path) => !existsSync(path))).toEqual([])
	})

	it('give every top level folder under src a README', () => {
		const missing = readdirSync('src')
			.filter((name) => statSync(join('src', name)).isDirectory())
			.filter((name) => !['assets', '__tests__'].includes(name))
			.filter((name) => !existsSync(join('src', name, 'README.md')))
		expect(missing).toEqual([])
	})

	it('allow a README only at the root of a widget, besides the sections', () => {
		const known = new Set([...SECTION_READMES, ...OTHER_DOCS, ...UNCHECKED_DOCS])
		const stray = markdown.filter(
			(path) => !known.has(path) && !WIDGET_README.test(path)
		)
		expect(stray).toEqual([])
	})

	it('name no file that is gone', () => {
		const missing = readDocs.flatMap((path) =>
			referencedFiles(path).map((token) => `${path}: ${token}`)
		)
		expect(missing).toEqual([])
	})

	it('link only to files that exist', () => {
		const broken = readDocs.flatMap((path) =>
			brokenLinks(path).map((target) => `${path}: ${target}`)
		)
		expect(broken).toEqual([])
	})

	it('stay short enough to read', () => {
		const tooLong = readDocs
			.map((path) => ({
				path,
				lines: readFileSync(path, 'utf8').split('\n').length,
				limit: WIDGET_README.test(path)
					? LONG_WIDGET_README
					: (LONG_READMES[path] ?? DEFAULT_LIMIT),
			}))
			.filter(({ lines, limit }) => lines > limit)
			.map(({ path, lines, limit }) => `${path}: ${lines} lines, limit ${limit}`)
		expect(tooLong).toEqual([])
	})

	it('name only npm scripts that package.json defines', () => {
		const scripts = Object.keys(
			JSON.parse(readFileSync('package.json', 'utf8')).scripts
		)
		const unknown = readDocs.flatMap((path) =>
			[...readFileSync(path, 'utf8').matchAll(/npm run ([\w:-]+)/g)]
				.map((match) => match[1])
				.filter((script) => !scripts.includes(script))
				.map((script) => `${path}: npm run ${script}`)
		)
		expect(unknown).toEqual([])
	})

	it('list only components that components/ui exports', () => {
		const exported = walk('src/components/ui')
			.filter((path) => /\.tsx?$/.test(path))
			.flatMap((path) =>
				[
					...readFileSync(path, 'utf8').matchAll(
						/export (?:const|function) (\w+)/g
					),
				].map((match) => match[1])
			)
		const listed = readFileSync('src/components/ui/README.md', 'utf8')
			.split('\n')
			.filter((line) => line.startsWith('|'))
			.flatMap((line) =>
				[...line.matchAll(/`([A-Z]\w+)`/g)].map((match) => match[1])
			)
		expect(listed.filter((name) => !exported.includes(name))).toEqual([])
	})

	it('list in the API docs every endpoint the app calls, and only those', () => {
		const called = calledEndpoints()
		const problems = API_DOCS.flatMap((path) => {
			const documented = documentedEndpoints(path)
			return [
				...called
					.filter((call) => !documented.some((doc) => sameEndpoint(call, doc)))
					.map((call) => `${path}: missing ${call}`),
				...documented
					.filter((doc) => !called.some((call) => sameEndpoint(call, doc)))
					.map((doc) => `${path}: the app never calls ${doc}`),
			]
		})
		expect(problems).toEqual([])
	})

	it('start with a title', () => {
		const untitled = readDocs.filter(
			(path) => !readFileSync(path, 'utf8').trimStart().startsWith('#')
		)
		expect(untitled).toEqual([])
	})
})
