import { Editor } from '@tiptap/react'
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import {
	StrictMode,
	Suspense,
	lazy,
	useEffect,
	useLayoutEffect,
	useState,
	type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import RichTextEditor from '@/features/widgets/components/rich-text-editor'
import { WidgetSlot } from '@/features/widgets/components/widget-slot'
import { syncRichTextContent } from '@/features/widgets/utils/rich-text-editor-content'
import type { WidgetDefinition } from '@/features/widgets/utils/layout-engine/types'
import '@/styles/index.css'

function required<T>(value: T | null | undefined): T {
	if (value == null) throw new Error('Missing regression element')
	return value
}
const host = required(document.getElementById('test-root'))
const report = required(document.getElementById('results'))
const filter = new URLSearchParams(location.search).get('case')
const results: { name: string; passed: boolean; detail?: string }[] = []
const uncaught: string[] = []
const caught: string[] = []
const events: { name: string; params: Record<string, unknown> }[] = []
const originalEvent = Analytics.event
Analytics.event = async (name, params = {}) => {
	events.push({ name, params })
	throw new Error('Regression telemetry unavailable')
}
window.addEventListener('error', (event) => uncaught.push(String(event.error)))
window.addEventListener('unhandledrejection', (event) =>
	uncaught.push(String(event.reason))
)
const root = createRoot(host, {
	onCaughtError: (error) => caught.push(String(error)),
	onUncaughtError: (error) => uncaught.push(String(error)),
})
function wait(ms?: number) {
	return new Promise<void>((resolve) => {
		if (ms !== undefined) {
			setTimeout(resolve, ms)
			return
		}
		const channel = new MessageChannel()
		channel.port1.onmessage = () => {
			channel.port1.close()
			channel.port2.close()
			resolve()
		}
		channel.port2.postMessage(null)
	})
}
function assert(condition: unknown, message: string): asserts condition {
	if (!condition) throw new Error(message)
}
async function until(predicate: () => boolean, detail = () => 'DOM') {
	const deadline = performance.now() + 5000
	while (!predicate()) {
		if (performance.now() > deadline)
			throw new Error(`Timed out waiting for ${detail()}`)
		await wait()
	}
}
function mount(node: ReactNode) {
	flushSync(() => root.render(<StrictMode>{node}</StrictMode>))
}
function editable(label = 'Regression note') {
	return host.querySelector<HTMLElement & { editor: Editor }>(
		`[contenteditable][aria-label="${label}"]`
	)
}
async function test(name: string, run: () => void | Promise<void>) {
	if (filter && !name.includes(filter)) return
	try {
		await run()
		results.push({ name, passed: true })
	} catch (error) {
		results.push({ name, passed: false, detail: String(error) })
	} finally {
		mount(null)
		await wait()
		report.textContent = results
			.map(
				(result) =>
					`${result.passed ? 'PASS' : 'FAIL'} ${result.name}${result.detail ? `: ${result.detail}` : ''}`
			)
			.join('\n')
	}
}
function note(value: string, onChange: (value: string) => void = () => {}) {
	return (
		<RichTextEditor
			value={value}
			ariaLabel="Regression note"
			placeholder="Empty note"
			onChange={onChange}
		/>
	)
}
function definition(node: WidgetDefinition['node']): WidgetDefinition {
	return { id: 'notes', node } as WidgetDefinition
}
function Neighbor() {
	const [count, setCount] = useState(0)
	return (
		<button
			type="button"
			id="neighbor"
			onClick={() => setCount((value) => value + 1)}
		>
			{count}
		</button>
	)
}
function board(item: WidgetDefinition, instanceId = 'fault', second?: WidgetDefinition) {
	return (
		<>
			<Neighbor />
			<section id="fault">
				<WidgetSlot
					definition={item}
					instanceId={instanceId}
					size={{ w: 2, h: 2 }}
				/>
			</section>
			{second && (
				<section id="second">
					<WidgetSlot
						definition={second}
						instanceId="second"
						size={{ w: 2, h: 2 }}
					/>
				</section>
			)}
		</>
	)
}
function retry(section = 'fault') {
	return Array.from(
		host.querySelectorAll<HTMLButtonElement>(`#${section} button`)
	).find((button) => button.textContent?.includes(t('widgets.error.retry')))
}

async function run() {
	await test('real TipTap destroyed commands fail, guarded sync skips them', () => {
		const editor = new Editor({ extensions: [StarterKit, Markdown], content: 'old' })
		editor.destroy()
		let message = ''
		try {
			editor.commands.setContent('new')
		} catch (error) {
			message = String(error)
		}
		assert(
			message.includes("reading 'commands'"),
			`Expected original crash, got ${message}`
		)
		syncRichTextContent(editor, 'new')
	})

	await test('suspended mount creates no render-time editors for the destroy timer', async () => {
		let release!: () => void
		let ready = false
		const gate = new Promise<void>((resolve) => {
			release = () => {
				ready = true
				resolve()
			}
		})
		function Delay(): ReactNode {
			if (!ready) throw gate
			return null
		}
		const originalDestroy = Editor.prototype.destroy
		let destroys = 0
		Editor.prototype.destroy = function () {
			destroys++
			return originalDestroy.call(this)
		}
		try {
			mount(
				<Suspense fallback={<span id="waiting">Waiting</span>}>
					{note('before commit')}
					<Delay />
				</Suspense>
			)
			await until(() => !!host.querySelector('#waiting'))
			await wait(60)
			assert(destroys === 0, `${destroys} editors destroyed before commit`)
			release()
			await until(() => editable()?.textContent === 'before commit')
		} finally {
			release()
			Editor.prototype.destroy = originalDestroy
		}
	})

	await test('aborted suspended mount never emits an edit', async () => {
		const updates: string[] = []
		const never = new Promise<void>(() => {})
		function Delay(): ReactNode {
			throw never
		}
		mount(
			<Suspense fallback={<span id="waiting">Waiting</span>}>
				{note('aborted', (value) => updates.push(value))}
				<Delay />
			</Suspense>
		)
		await until(() => !!host.querySelector('#waiting'))
		mount(null)
		await wait(60)
		assert(
			updates.length === 0 && !editable(),
			'Aborted mount emitted or left an editor'
		)
	})

	await test('20 StrictMode mount/unmount cycles destroy old instances without edits', async () => {
		const updates: string[] = []
		for (let cycle = 0; cycle < 20; cycle++) {
			mount(note(`cycle ${cycle}`, (value) => updates.push(value)))
			await until(() => editable()?.textContent === `cycle ${cycle}`)
			const editor = required(editable()).editor
			mount(null)
			await until(() => editor.isDestroyed)
			syncRichTextContent(editor, 'stale external value')
		}
		assert(updates.length === 0, 'Mount/unmount emitted edits')
	})

	await test('external Markdown, empty state and matching selection survive sync', async () => {
		const updates: string[] = []
		const onChange = (value: string) => updates.push(value)
		mount(note('initial', onChange))
		await until(() => !!editable())
		const editor = required(editable()).editor
		for (const value of [
			'**bold**',
			'*italic*',
			'- one\n- two',
			'1. one\n2. two',
			'- [ ] open\n- [x] done',
			'',
			'日本語 🙂 café',
		]) {
			mount(note(value, onChange))
			await until(
				() => editor.getMarkdown().trimEnd() === value,
				() =>
					`Markdown ${JSON.stringify(value)}, got ${JSON.stringify(editor.getMarkdown())}`
			)
			assert(
				required(editable()).editor === editor,
				'External update recreated editor'
			)
			assert(
				!value || !host.textContent?.includes('Empty note'),
				'Nonempty note kept placeholder'
			)
			if (!value)
				assert(
					host.textContent?.includes('Empty note'),
					'Empty placeholder missing'
				)
		}
		editor.commands.setTextSelection({ from: 1, to: 3 })
		mount(note(editor.getMarkdown(), onChange))
		await wait()
		assert(
			editor.state.selection.from === 1 && editor.state.selection.to === 3,
			'Matching content reset selection'
		)
		assert(updates.length === 0, 'External sync emitted edits')
	})

	await test('latest onChange callback receives user edits, old callback stays unused', async () => {
		const old: string[] = []
		const latest: string[] = []
		mount(note('initial', (value) => old.push(value)))
		await until(() => !!editable())
		mount(note('initial', (value) => latest.push(value)))
		required(editable()).editor.commands.insertContent('typed ')
		await until(() => latest.length > 0)
		assert(
			old.length === 0 && latest.at(-1)?.includes('typed'),
			'Stale callback used'
		)
	})

	await test('two editors keep independent content and callbacks', async () => {
		const updates: string[] = []
		mount(
			<>
				{note('first')}
				<RichTextEditor
					value="second"
					ariaLabel="Second note"
					onChange={(value) => updates.push(value)}
				/>
			</>
		)
		await until(() => !!editable() && !!editable('Second note'))
		required(editable('Second note')).editor.commands.insertContent('changed ')
		assert(
			required(editable()).textContent === 'first',
			'Editing second changed first'
		)
		assert(
			updates.length === 1 && updates[0].includes('changed'),
			'Second update lost'
		)
	})

	for (const [label, command, selector] of [
		['bold', 'toggleBold', 'strong'],
		['italic', 'toggleItalic', 'em'],
		['bullets', 'toggleBulletList', 'ul:not([data-type])'],
		['numbers', 'toggleOrderedList', 'ol'],
		['checklist', 'toggleTaskList', 'ul[data-type="taskList"]'],
	] as const) {
		await test(`${label} toolbar action formats and serializes Markdown`, async () => {
			const updates: string[] = []
			mount(note('format me', (value) => updates.push(value)))
			await until(() => !!editable())
			const editor = required(editable()).editor
			required(editable()).dispatchEvent(new FocusEvent('focus'))
			editor.commands.selectAll()
			await until(
				() => host.querySelectorAll('[role="toolbar"] button').length === 5
			)
			const index = [
				'toggleBold',
				'toggleItalic',
				'toggleBulletList',
				'toggleOrderedList',
				'toggleTaskList',
			].indexOf(command)
			host.querySelectorAll<HTMLButtonElement>('[role="toolbar"] button')[
				index
			].click()
			await until(() => !!editable()?.querySelector(selector))
			assert(
				updates.length > 0 && updates.at(-1) === editor.getMarkdown(),
				'Formatted Markdown not emitted'
			)
		})
	}

	for (const phase of ['factory', 'render', 'layout', 'effect', 'lazy'] as const) {
		for (const theme of ['light', 'dark', 'glass', 'icy', 'zarna']) {
			await test(`${theme} ${phase} failure stays isolated and retry preserves neighbor`, async () => {
				document.documentElement.dataset.theme = theme
				let failing = true
				const fail = () => {
					throw new Error(`Regression fault ${phase}: private note`)
				}
				function Fault() {
					useLayoutEffect(() => {
						if (failing && phase === 'layout') fail()
					}, [])
					useEffect(() => {
						if (failing && phase === 'effect') fail()
					}, [])
					if (failing && phase === 'render') fail()
					return <span id="recovered">Recovered</span>
				}
				const Rejected = lazy(() =>
					Promise.reject(new Error('Regression lazy rejection'))
				)
				const item = definition(() => {
					if (failing && phase === 'factory') fail()
					if (failing && phase === 'lazy') return <Rejected />
					return <Fault />
				})
				mount(board(item))
				await until(() => !!retry())
				assert(!host.querySelector('#recovered'), 'Failed widget still mounted')
				required(host.querySelector<HTMLButtonElement>('#neighbor')).click()
				await until(() => host.querySelector('#neighbor')?.textContent === '1')
				const failuresBeforeRetry = caught.length
				required(retry()).click()
				await until(() => caught.length > failuresBeforeRetry && !!retry())
				failing = false
				required(retry()).click()
				await until(() => !!host.querySelector('#recovered'))
				assert(
					host.querySelector('#neighbor')?.textContent === '1',
					'Retry reset adjacent state'
				)
			})
		}
	}

	await test('one failed widget cannot recover or reset another failed instance', async () => {
		let firstFails = true
		let secondFails = true
		const first = definition(() => {
			if (firstFails) throw new Error('Regression first')
			return <span id="first-ok">First</span>
		})
		const second = definition(() => {
			if (secondFails) throw new Error('Regression second')
			return <span id="second-ok">Second</span>
		})
		mount(board(first, 'first', second))
		await until(() => !!retry() && !!retry('second'))
		firstFails = false
		required(retry()).click()
		await until(() => !!host.querySelector('#first-ok'))
		assert(
			!!retry('second') && !host.querySelector('#second-ok'),
			'First retry changed second boundary'
		)
		secondFails = false
		required(retry('second')).click()
		await until(() => !!host.querySelector('#second-ok'))
	})

	await test('replacing a failed instance resets its boundary without retry', async () => {
		let fails = true
		const item = definition(() => {
			if (fails) throw new Error('Regression replaced')
			return <span id="replacement">Replacement</span>
		})
		mount(board(item, 'old'))
		await until(() => !!retry())
		fails = false
		mount(board(item, 'new'))
		await until(() => !!host.querySelector('#replacement'))
	})

	await test('crash telemetry contains only widget key, rejected telemetry never escapes', async () => {
		await wait(80)
		assert(
			events.some((event) => event.name === 'widget_render_failed'),
			'Crash event missing'
		)
		assert(
			events.some((event) => event.name === 'widget_render_retried'),
			'Retry event missing'
		)
		assert(
			events.every(
				(event) =>
					Object.keys(event.params).join() === 'widget' &&
					event.params.widget === 'notes'
			),
			'Telemetry leaked extra fields'
		)
		assert(caught.length > 0, 'No React boundary failures observed')
		assert(uncaught.length === 0, `Uncaught errors: ${uncaught.join('; ')}`)
	})
	Analytics.event = originalEvent
	if (!results.length) throw new Error('No regression cases matched')
	const failed = results.filter((result) => !result.passed).length
	report.textContent += `\nRESULT ${results.length - failed}/${results.length} passed; ${failed} failed`
	document.documentElement.dataset.result = failed ? 'fail' : 'pass'
	document.title = `${failed ? 'FAIL' : 'PASS'} editor lifecycle regression`
}
void run().catch((error) => {
	Analytics.event = originalEvent
	report.textContent += `\nRUNNER FAILED ${String(error)}`
	document.documentElement.dataset.result = 'fail'
})
