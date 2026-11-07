export interface RichTextRun {
	text: string
	bold: boolean
	italic: boolean
}

export type RichTextListStyle = 'bullet' | 'number' | 'check'

export interface RichTextListItem {
	runs: RichTextRun[]
	checked: boolean
}

type RichTextBlock =
	| { kind: 'paragraph'; runs: RichTextRun[] }
	| { kind: 'list'; style: RichTextListStyle; items: RichTextListItem[] }

interface ListLine {
	style: RichTextListStyle
	checked: boolean
	text: string
}

const CHECK_LINE = /^- \[([ xX])\](?: (.*))?$/
const BULLET_LINE = /^- (\S.*)$/
const NUMBER_LINE = /^\d+\. (\S.*)$/
const MARKED_TEXT = /\*\*(\S(?:.*?\S)?)\*\*(?!\*)|\*(\S(?:.*?\S)?)\*/g

function parseListLine(line: string): ListLine | null {
	const check = CHECK_LINE.exec(line)
	if (check) {
		return { style: 'check', checked: check[1] !== ' ', text: check[2] ?? '' }
	}
	const bullet = BULLET_LINE.exec(line)
	if (bullet) return { style: 'bullet', checked: false, text: bullet[1] }
	const number = NUMBER_LINE.exec(line)
	if (number) return { style: 'number', checked: false, text: number[1] }
	return null
}

function parseRuns(text: string, bold = false, italic = false): RichTextRun[] {
	const runs: RichTextRun[] = []
	let cursor = 0
	for (const match of text.matchAll(MARKED_TEXT)) {
		const start = match.index ?? 0
		if (start > cursor) {
			runs.push({ text: text.slice(cursor, start), bold, italic })
		}
		const [whole, boldInner, italicInner] = match
		if (boldInner !== undefined) {
			runs.push(...parseRuns(boldInner, true, italic))
		} else {
			runs.push(...parseRuns(italicInner, bold, true))
		}
		cursor = start + whole.length
	}
	if (cursor < text.length) {
		runs.push({ text: text.slice(cursor), bold, italic })
	}
	return runs
}

export function parseRichText(source: string): RichTextBlock[] {
	const blocks: RichTextBlock[] = []
	let paragraphLines: string[] = []

	const endParagraph = () => {
		if (paragraphLines.length === 0) return
		blocks.push({ kind: 'paragraph', runs: parseRuns(paragraphLines.join('\n')) })
		paragraphLines = []
	}

	for (const line of source.replace(/\r\n?/g, '\n').split('\n')) {
		const listLine = parseListLine(line)
		if (!listLine) {
			if (line.trim() === '') endParagraph()
			else paragraphLines.push(line)
			continue
		}
		endParagraph()
		const item = { runs: parseRuns(listLine.text), checked: listLine.checked }
		const last = blocks[blocks.length - 1]
		if (last?.kind === 'list' && last.style === listLine.style) {
			last.items.push(item)
		} else {
			blocks.push({ kind: 'list', style: listLine.style, items: [item] })
		}
	}
	endParagraph()
	return blocks
}

export function toggleChecklistItem(source: string, position: number): string {
	let seen = 0
	return source
		.replace(/\r\n?/g, '\n')
		.split('\n')
		.map((line) => {
			if (!CHECK_LINE.test(line)) return line
			const current = seen++
			if (current !== position) return line
			return line.replace(/^- \[([ xX])\]/, (_, mark) =>
				mark === ' ' ? '- [x]' : '- [ ]'
			)
		})
		.join('\n')
}

export function isRichText(source: string): boolean {
	return parseRichText(source).some(
		(block) =>
			block.kind === 'list' || block.runs.some((run) => run.bold || run.italic)
	)
}

function runsToText(runs: RichTextRun[]): string {
	return runs.map((run) => run.text).join('')
}

function listItemToText(
	style: RichTextListStyle,
	item: RichTextListItem,
	index: number
): string {
	const text = runsToText(item.runs)
	if (style === 'bullet') return `• ${text}`
	if (style === 'number') return `${index + 1}. ${text}`
	return `${item.checked ? '☑' : '☐'} ${text}`
}

export function richTextToPlain(source: string): string {
	if (!isRichText(source)) return source
	return parseRichText(source)
		.flatMap((block) =>
			block.kind === 'paragraph'
				? [runsToText(block.runs)]
				: block.items.map((item, index) =>
						listItemToText(block.style, item, index)
					)
		)
		.join(' ')
}
