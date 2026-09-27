import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
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
