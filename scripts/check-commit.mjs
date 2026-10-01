import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmdirSync, symlinkSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const root = process.cwd()
const ref = process.argv[2] ?? 'HEAD'
const linked = ['node_modules', '.wxt']
const WHO_WROTE_IT =
	/\b(claude|anthropic|co-authored-by|generated with|chatgpt|openai|copilot)\b/i

function run(command, args, cwd) {
	execFileSync(command, args, { cwd, stdio: 'inherit' })
}

function unlink(path) {
	try {
		unlinkSync(path)
		return true
	} catch (error) {
		console.error(`Could not remove the link ${path}: ${error.message}`)
		return false
	}
}

function messageIsClean() {
	const message = execFileSync('git', ['log', '-1', '--format=%B', ref], {
		cwd: root,
		encoding: 'utf8',
	})
	const offending = message.split('\n').filter((line) => WHO_WROTE_IT.test(line))
	for (const line of offending) console.error(`The message names its author: ${line}`)
	return offending.length === 0
}

const clean = messageIsClean()

const parent = mkdtempSync(join(tmpdir(), 'check-commit-'))
const tree = join(parent, 'tree')

run('git', ['worktree', 'add', '--detach', tree, ref], root)

let compiles = true
try {
	for (const name of linked) symlinkSync(join(root, name), join(tree, name), 'junction')
	run('node', [join('node_modules', 'typescript', 'bin', 'tsc'), '--noEmit'], tree)
} catch {
	compiles = false
}

const unlinked = linked
	.map((name) => join(tree, name))
	.filter((path) => existsSync(path))
	.map(unlink)
	.every(Boolean)

if (!unlinked) {
	console.error(
		`Left ${tree} in place so no link is followed. Remove the links by hand.`
	)
	process.exit(1)
}

run('git', ['worktree', 'remove', '--force', tree], root)
rmdirSync(parent)

console.log(
	compiles ? `${ref} compiles on its own.` : `${ref} does not compile on its own.`
)
console.log(
	clean ? `The message of ${ref} is clean.` : `The message of ${ref} is not clean.`
)
process.exit(compiles && clean ? 0 : 1)
