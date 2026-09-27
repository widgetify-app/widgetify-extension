import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, posix, relative, resolve, sep } from 'node:path'
import ts from 'typescript'

const ROOT = process.cwd()
const SOURCE_ROOTS = ['src', 'background', 'entrypoints']

function toRepoPath(path: string): string {
	return relative(ROOT, path).split(sep).join('/')
}

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((entry) => {
		const path = join(dir, entry)
		return statSync(path).isDirectory() ? walk(path) : [toRepoPath(path)]
	})
}

function isTest(path: string): boolean {
	return path.includes('/__tests__/')
}

const projectFiles = SOURCE_ROOTS.flatMap(walk).filter(
	(path) => /\.tsx?$/.test(path) && !path.endsWith('.d.ts')
)

const { options } = ts.parseJsonConfigFileContent(
	ts.readConfigFile('tsconfig.json', ts.sys.readFile).config,
	ts.sys,
	ROOT
)
const program = ts.createProgram(
	projectFiles.map((path) => resolve(path)),
	options
)
const checker = program.getTypeChecker()

function sourceFile(path: string): ts.SourceFile {
	const file = program.getSourceFile(resolve(path))
	if (!file) throw new Error(`${path} is not in the program`)
	return file
}

function forEachNode(file: ts.SourceFile, visit: (node: ts.Node) => void) {
	const walkNode = (node: ts.Node) => {
		visit(node)
		ts.forEachChild(node, walkNode)
	}
	walkNode(file)
}

function moduleSpecifiers(file: ts.SourceFile): ts.StringLiteral[] {
	const found: ts.StringLiteral[] = []
	forEachNode(file, (node) => {
		if (
			(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
			node.moduleSpecifier &&
			ts.isStringLiteral(node.moduleSpecifier)
		) {
			found.push(node.moduleSpecifier)
		} else if (
			ts.isCallExpression(node) &&
			node.expression.kind === ts.SyntaxKind.ImportKeyword &&
			node.arguments[0] &&
			ts.isStringLiteral(node.arguments[0])
		) {
			found.push(node.arguments[0])
		} else if (
			ts.isImportTypeNode(node) &&
			ts.isLiteralTypeNode(node.argument) &&
			ts.isStringLiteral(node.argument.literal)
		) {
			found.push(node.argument.literal)
		}
	})
	return found
}

function resolveInProject(specifier: string, from: string): string | undefined {
	const resolved = ts.resolveModuleName(
		specifier,
		resolve(from),
		options,
		ts.sys
	).resolvedModule
	if (!resolved || resolved.isExternalLibraryImport) return undefined
	const path = toRepoPath(resolved.resolvedFileName)
	return projectFiles.includes(path) ? path : undefined
}

const imports = new Map(
	projectFiles.map((path) => [
		path,
		moduleSpecifiers(sourceFile(path))
			.map((specifier) => resolveInProject(specifier.text, path))
			.filter((target): target is string => target !== undefined),
	])
)

function entrypoints(): string[] {
	const scripts = walk('entrypoints')
		.filter((path) => path.endsWith('.html'))
		.flatMap((html) =>
			[...readFileSync(html, 'utf8').matchAll(/<script[^>]+src="([^"]+)"/g)].map(
				(match) => toRepoPath(resolve(dirname(html), match[1]))
			)
		)
	return [...projectFiles.filter((path) => path.startsWith('entrypoints/')), ...scripts]
}

function aliasTarget(symbol: ts.Symbol): ts.Symbol {
	return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
}

function importedSymbols(): Set<ts.Symbol> {
	const used = new Set<ts.Symbol>()
	const markImported = (node: ts.Node) => {
		const symbol = checker.getSymbolAtLocation(node)
		if (symbol) used.add(aliasTarget(symbol))
	}
	const markModuleImported = (specifier: ts.Node) => {
		const module = checker.getSymbolAtLocation(specifier)
		if (!module) return
		for (const exported of checker.getExportsOfModule(module)) {
			used.add(aliasTarget(exported))
		}
	}
	for (const path of projectFiles) {
		forEachNode(sourceFile(path), (node) => {
			if (ts.isImportDeclaration(node) && node.importClause) {
				const { name, namedBindings } = node.importClause
				if (name) markImported(name)
				if (namedBindings && ts.isNamespaceImport(namedBindings)) {
					markModuleImported(node.moduleSpecifier)
				} else if (namedBindings) {
					for (const element of namedBindings.elements)
						markImported(element.name)
				}
			} else if (
				ts.isCallExpression(node) &&
				node.expression.kind === ts.SyntaxKind.ImportKeyword &&
				node.arguments[0]
			) {
				markModuleImported(node.arguments[0])
			} else if (ts.isImportTypeNode(node) && node.qualifier) {
				markImported(
					ts.isQualifiedName(node.qualifier)
						? node.qualifier.right
						: node.qualifier
				)
			}
		})
	}
	return used
}

function packageName(specifier: string): string {
	const parts = specifier.split('/')
	return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

describe('dead code', () => {
	it('reaches every file from an entrypoint', () => {
		const reached = new Set<string>()
		const pending = entrypoints()
		while (pending.length > 0) {
			const path = pending.pop() as string
			if (reached.has(path)) continue
			reached.add(path)
			pending.push(...(imports.get(path) ?? []))
		}
		const unreached = projectFiles.filter(
			(path) => !isTest(path) && !reached.has(path)
		)
		expect(unreached).toEqual([])
	})

	it('exports only what another file imports', () => {
		const used = importedSymbols()
		const unused: string[] = []
		for (const path of projectFiles) {
			if (isTest(path) || path.startsWith('entrypoints/')) continue
			const file = sourceFile(path)
			const module = checker.getSymbolAtLocation(file)
			if (!module) continue
			for (const exported of checker.getExportsOfModule(module)) {
				const target = aliasTarget(exported)
				if (target.declarations?.[0]?.getSourceFile() !== file) continue
				if (!used.has(target)) unused.push(`${path}: ${exported.name}`)
			}
		}
		expect(unused).toEqual([])
	})

	it('imports every runtime dependency somewhere', () => {
		const { dependencies } = JSON.parse(readFileSync('package.json', 'utf8'))
		const imported = new Set(
			projectFiles
				.filter((path) => !isTest(path))
				.flatMap((path) => moduleSpecifiers(sourceFile(path)))
				.map((specifier) => specifier.text)
				.filter(
					(specifier) =>
						!specifier.startsWith('.') && !specifier.startsWith('@/')
				)
				.map(packageName)
		)
		const modulesBlock = readFileSync('wxt.config.ts', 'utf8').match(
			/modules:\s*\[([^\]]*)\]/
		)
		for (const match of modulesBlock?.[1].matchAll(/'([^']+)'/g) ?? []) {
			imported.add(packageName(match[1]))
		}
		const unused = Object.keys(dependencies).filter((name) => !imported.has(name))
		expect(unused).toEqual([])
	})
})

const ROLE_FOLDERS = ['components', 'variants', 'hooks', 'utils', '__tests__']
const GROUPING_ROLES = ['components', 'utils']
const BARRELS = ['src/components/ui', 'src/components/gallery', 'src/icons']
const SUFFIXES = ['widget', 'page', 'context', 'hook', 'variants', 'interface', 'test']

const srcFiles = walk('src')
const srcFileSet = new Set(srcFiles)

function nameOf(path: string): string {
	return path.slice(path.lastIndexOf('/') + 1)
}

function parentOf(path: string): string {
	return path.slice(0, path.lastIndexOf('/'))
}

function directoriesUnder(root: string): string[] {
	const found = new Set<string>()
	for (const path of srcFiles.filter((file) => file.startsWith(`${root}/`))) {
		for (let dir = parentOf(path); dir.length > root.length; dir = parentOf(dir)) {
			found.add(dir)
		}
	}
	return [...found].sort()
}

function filesIn(dir: string): string[] {
	return srcFiles.filter((path) => parentOf(path) === dir).map(nameOf)
}

function isInsideRoleFolder(dir: string): boolean {
	return dir.split('/').some((part) => ROLE_FOLDERS.includes(part))
}

const featureFolders = [
	...directoriesUnder('src/features'),
	...directoriesUnder('src/pages'),
].filter((dir) => !isInsideRoleFolder(dir))

function entryNames(dir: string): string[] {
	const name = nameOf(dir)
	const parent = parentOf(dir)
	if (parent === 'src/pages') return [`${name}.page.tsx`]
	if (parent === 'src/features/widgets') return [`${name}.widget.tsx`, `${name}.tsx`]
	return [`${name}.tsx`]
}

function hasJsx(file: ts.SourceFile): boolean {
	let found = false
	forEachNode(file, (node) => {
		if (
			ts.isJsxElement(node) ||
			ts.isJsxSelfClosingElement(node) ||
			ts.isJsxFragment(node)
		) {
			found = true
		}
	})
	return found
}

function unitOf(path: string): string {
	const parts = path.split('/')
	if (parts[1] === 'features' || parts[1] === 'pages') {
		return parts.slice(0, parts.length > 3 ? 3 : 2).join('/')
	}
	return parts.length > 2 ? parts.slice(0, 2).join('/') : 'src'
}

function declaredAliases(): string[] {
	const block = readFileSync('wxt.config.ts', 'utf8').match(/alias:\s*\{([^}]*)\}/)
	return [...(block?.[1].matchAll(/'(@\/[a-z-]+)'/g) ?? [])].map((match) => match[1])
}

describe('feature folders', () => {
	it('hold only feature folders at the top of features and pages', () => {
		const stray = [
			...filesIn('src/features').map((file) => `src/features/${file}`),
			...filesIn('src/pages')
				.filter((file) => file !== 'root.tsx')
				.map((file) => `src/pages/${file}`),
		]
		expect(stray).toEqual([])
	})

	it('name their entry file after the folder', () => {
		const missing = featureFolders.filter(
			(dir) => !filesIn(dir).some((file) => entryNames(dir).includes(file))
		)
		expect(missing).toEqual([])
	})

	it('keep only the entry, settings, contexts, types and constants at their root', () => {
		const stray: string[] = []
		for (const dir of featureFolders) {
			const allowed = [...entryNames(dir), `${nameOf(dir)}-setting.tsx`]
			for (const file of filesIn(dir)) {
				const fits =
					allowed.includes(file) ||
					file.endsWith('.context.tsx') ||
					['types.ts', 'constants.ts', 'constants.tsx'].includes(file)
				if (!fits) stray.push(`${dir}/${file}`)
			}
		}
		expect(stray).toEqual([])
	})

	it('nest a role folder at most one named group deep', () => {
		const tooDeep: string[] = []
		for (const dir of [
			...directoriesUnder('src/features'),
			...directoriesUnder('src/pages'),
		]) {
			const parts = dir.split('/')
			const roleIndex = parts.findIndex((part) => ROLE_FOLDERS.includes(part))
			if (roleIndex < 0) continue
			const depth = parts.length - roleIndex - 1
			const grouping = GROUPING_ROLES.includes(parts[roleIndex])
			if (depth > 1 || (depth === 1 && !grouping)) tooDeep.push(dir)
		}
		expect(tooDeep).toEqual([])
	})

	it('keep hooks in hooks/ and nothing else there', () => {
		const misplaced = srcFiles
			.filter(
				(path) =>
					path.startsWith('src/features/') || path.startsWith('src/pages/')
			)
			.filter((path) => {
				const inHooks = nameOf(parentOf(path)) === 'hooks'
				const isHook = /^use-[a-z0-9-]+\.tsx?$/.test(nameOf(path))
				return inHooks !== isHook
			})
		expect(misplaced).toEqual([])
	})
})

describe('file names', () => {
	it('are kebab-case with a suffix from the closed list', () => {
		const pattern = new RegExp(
			`^[a-z0-9]+(-[a-z0-9]+)*(\\.(${SUFFIXES.join('|')}))?\\.(tsx?|css)$`
		)
		const badFiles = srcFiles
			.filter(
				(path) => !path.startsWith('src/assets/') && /\.(tsx?|css)$/.test(path)
			)
			.filter((path) => !path.endsWith('.d.ts') && !pattern.test(nameOf(path)))
		const badFolders = directoriesUnder('src').filter(
			(dir) =>
				!dir.startsWith('src/assets') &&
				nameOf(dir) !== '__tests__' &&
				!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(nameOf(dir))
		)
		expect([...badFiles, ...badFolders]).toEqual([])
	})

	it('end in .tsx exactly when the file contains JSX', () => {
		const wrong = projectFiles.filter(
			(path) => path.endsWith('.tsx') && !hasJsx(sourceFile(path))
		)
		expect(wrong).toEqual([])
	})

	it('keep tests in __tests__ and nothing else there', () => {
		const misplaced = srcFiles.filter(
			(path) => isTest(path) !== nameOf(path).endsWith('.test.ts')
		)
		expect(misplaced).toEqual([])
	})

	it('put each role suffix where that role lives', () => {
		const misplaced = srcFiles.filter((path) => {
			const name = nameOf(path)
			const dir = parentOf(path)
			if (name.endsWith('.widget.tsx'))
				return parentOf(dir) !== 'src/features/widgets'
			if (name.endsWith('.page.tsx')) return parentOf(dir) !== 'src/pages'
			if (name.endsWith('.hook.ts')) return !path.startsWith('src/services/')
			if (name.endsWith('.variants.ts'))
				return !path.startsWith('src/components/ui/')
			if (name.endsWith('.interface.ts')) {
				return path.startsWith('src/features/') || path.startsWith('src/pages/')
			}
			return false
		})
		expect(misplaced).toEqual([])
	})
})

describe('imports', () => {
	it('keep index files to the barrels', () => {
		const extra = srcFiles.filter(
			(path) =>
				/^index\.tsx?$/.test(nameOf(path)) && !BARRELS.includes(parentOf(path))
		)
		expect(extra).toEqual([])
	})

	it('reach a barrel folder only through its index', () => {
		const past: string[] = []
		for (const [importer, targets] of imports) {
			for (const target of targets) {
				const barrel = BARRELS.find((dir) => target.startsWith(`${dir}/`))
				if (!barrel || importer.startsWith(`${barrel}/`)) continue
				if (!/\/index\.tsx?$/.test(target)) past.push(`${importer} -> ${target}`)
			}
		}
		expect(past).toEqual([])
	})

	it('use only the aliases the build declares', () => {
		const aliases = declaredAliases()
		const undeclared: string[] = []
		for (const path of projectFiles.filter((file) => file.startsWith('src/'))) {
			for (const specifier of moduleSpecifiers(sourceFile(path))) {
				const text = specifier.text
				if (text.startsWith('.')) continue
				const local = text.startsWith('@/') || resolveInProject(text, path)
				if (!local) continue
				if (
					!aliases.some(
						(alias) => text === alias || text.startsWith(`${alias}/`)
					)
				) {
					undeclared.push(`${path}: ${text}`)
				}
			}
		}
		expect(undeclared).toEqual([])
	})

	it('keep a relative import inside the feature or folder it starts in', () => {
		const crossing: string[] = []
		for (const path of projectFiles.filter((file) => file.startsWith('src/'))) {
			for (const specifier of moduleSpecifiers(sourceFile(path))) {
				if (!specifier.text.startsWith('.')) continue
				const joined = posix.normalize(posix.join(parentOf(path), specifier.text))
				const target =
					resolveInProject(specifier.text, path) ??
					(srcFileSet.has(joined) ? joined : undefined)
				if (target && unitOf(target) !== unitOf(path)) {
					crossing.push(`${path}: ${specifier.text}`)
				}
			}
		}
		expect(crossing).toEqual([])
	})
})
