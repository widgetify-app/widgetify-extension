import { describe, expect, it } from 'bun:test'
import { syncRichTextContent } from '../utils/rich-text-editor-content'

describe('syncRichTextContent', () => {
	it('waits for an editor to be mounted', () => {
		expect(() => syncRichTextContent(null, 'synced note')).not.toThrow()
	})

	it('never reads content or commands from a destroyed instance', () => {
		const destroyedEditor = {
			isDestroyed: true,
			getMarkdown(): string {
				throw new Error('Destroyed editor content was read')
			},
			get commands(): never {
				throw new TypeError("Cannot read properties of null (reading 'commands')")
			},
		}

		expect(() => syncRichTextContent(destroyedEditor, 'synced note')).not.toThrow()
	})

	it('does not reset the selection when content already matches', () => {
		const editor = {
			isDestroyed: false,
			getMarkdown: () => 'same note',
			get commands(): never {
				throw new Error('Matching content must not be replaced')
			},
		}

		expect(() => syncRichTextContent(editor, 'same note')).not.toThrow()
	})

	it('applies external changes and empty content silently to a live editor', () => {
		const changes: unknown[] = []
		const editor = {
			isDestroyed: false,
			getMarkdown: () => 'old note',
			commands: {
				setContent: (value: string, options: unknown) => {
					changes.push([value, options])
				},
			},
		}

		syncRichTextContent(editor, '**synced note**')
		syncRichTextContent(editor, '')
		expect(changes).toEqual([
			['**synced note**', { contentType: 'markdown', emitUpdate: false }],
			['', { contentType: 'markdown', emitUpdate: false }],
		])
	})

	it('ignores a stale instance and syncs its live replacement', () => {
		const values: string[] = []
		const editor = {
			isDestroyed: false,
			getMarkdown: () => 'old note',
			commands: {
				setContent: (value: string) => values.push(value),
			},
		}
		const staleEditor = { ...editor, isDestroyed: true }

		syncRichTextContent(staleEditor, 'new note')
		syncRichTextContent(editor, 'new note')
		expect(values).toEqual(['new note'])
	})
	for (const [name, value] of [
		['empty note', ''],
		['bold and italic', '**bold** and *italic*'],
		['paragraphs', 'first\n\nsecond'],
		['bullets', '- first\n- second'],
		['numbered list', '1. first\n2. second'],
		['checklist', '- [ ] open\n- [x] done'],
		['Unicode', '日本語 🙂 café'],
		['long note', 'note '.repeat(20_000)],
	]) {
		it(`preserves ${name} exactly without emitting an edit`, () => {
			const calls: unknown[] = []
			const editor = {
				isDestroyed: false,
				getMarkdown: () => 'previous content',
				commands: {
					setContent: (content: string, options: unknown) => {
						calls.push([content, options])
					},
				},
			}

			syncRichTextContent(editor, value)
			expect(calls).toEqual([
				[value, { contentType: 'markdown', emitUpdate: false }],
			])
		})
	}

	it('checks lifecycle before reading Markdown and commands', () => {
		const order: string[] = []
		const editor = {
			get isDestroyed() {
				order.push('lifecycle')
				return false
			},
			getMarkdown: () => {
				order.push('markdown')
				return 'old'
			},
			get commands() {
				order.push('commands')
				return { setContent: () => order.push('setContent') }
			},
		}

		syncRichTextContent(editor, 'new')
		expect(order).toEqual(['lifecycle', 'markdown', 'commands', 'setContent'])
	})

	it('does not read commands when both the external and current note are empty', () => {
		const editor = {
			isDestroyed: false,
			getMarkdown: () => '',
			get commands(): never {
				throw new Error('Empty content must not reset the selection')
			},
		}

		expect(() => syncRichTextContent(editor, '')).not.toThrow()
	})

	it('uses the newest external value after mount and skips repeated matching renders', () => {
		const applied: string[] = []
		let current = 'initial'
		const editor = {
			isDestroyed: false,
			getMarkdown: () => current,
			commands: {
				setContent: (value: string) => {
					current = value
					applied.push(value)
				},
			},
		}

		syncRichTextContent(null, 'obsolete pending value')
		syncRichTextContent(editor, 'latest value')
		syncRichTextContent(editor, 'latest value')
		syncRichTextContent(editor, '')
		syncRichTextContent(editor, '')
		expect(applied).toEqual(['latest value', ''])
	})

	it('never reuses content or commands after a live editor is destroyed', () => {
		let destroyed = false
		let writes = 0
		const editor = {
			get isDestroyed() {
				return destroyed
			},
			getMarkdown: () => {
				if (destroyed) throw new Error('Stale Markdown access')
				return 'old'
			},
			get commands() {
				if (destroyed) throw new Error('Stale command access')
				return { setContent: () => writes++ }
			},
		}

		syncRichTextContent(editor, 'new')
		destroyed = true
		for (let render = 0; render < 100; render++) {
			syncRichTextContent(editor, `pending ${render}`)
		}
		expect(writes).toBe(1)
	})

	it('does not hide live command errors from the widget error boundary', () => {
		const failure = new Error('Invalid live document')
		const editor = {
			isDestroyed: false,
			getMarkdown: () => 'old',
			commands: {
				setContent: () => {
					throw failure
				},
			},
		}

		expect(() => syncRichTextContent(editor, 'new')).toThrow(failure)
	})
})
