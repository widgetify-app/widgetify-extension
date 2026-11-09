export type BodyColor = 'red' | 'green' | 'blue' | 'orange' | 'purple' | 'gray'

export interface BodyRun {
	text: string
	bold?: boolean
	italic?: boolean
	underline?: boolean
	color?: BodyColor
	href?: string
}

type BodyBlock =
	| { kind: 'paragraph'; runs: BodyRun[] }
	| { kind: 'list'; ordered: boolean; items: BodyRun[][] }

const COLORS: BodyColor[] = ['red', 'green', 'blue', 'orange', 'purple', 'gray']
const HEX: Record<string, BodyColor> = {
	'#d33': 'red',
	'#0a8f4f': 'green',
	'#1f6fe0': 'blue',
	'#e07a00': 'orange',
	'#7a3fd0': 'purple',
	'#6d6d6d': 'gray',
}

const RICH_START = /^\s*<(p|ul|ol)[\s>]/
const TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s[^<>]*?)?)\s*\/?>/g
const ATTRIBUTE = /([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
const ENTITY = /&(?:amp|lt|gt|quot|nbsp|#39|#\d+);/g

function decode(text: string): string {
	return text.replace(ENTITY, (entity) => {
		switch (entity) {
			case '&amp;':
				return '&'
			case '&lt;':
				return '<'
			case '&gt;':
				return '>'
			case '&quot;':
				return '"'
			case '&nbsp;':
				return ' '
			case '&#39;':
				return "'"
			default:
				return String.fromCodePoint(Number.parseInt(entity.slice(2, -1), 10))
		}
	})
}

function attributes(source: string): Record<string, string> {
	const found: Record<string, string> = {}

	for (const match of source.matchAll(ATTRIBUTE)) {
		found[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? '')
	}

	return found
}

function colorOf(found: Record<string, string>): BodyColor | undefined {
	const named = found['data-color'] as BodyColor | undefined

	if (named && COLORS.includes(named)) return named

	return HEX[(found.color ?? '').toLowerCase()]
}

function isHttps(value: string | undefined): value is string {
	return typeof value === 'string' && /^https:\/\/\S+\.\S+$/i.test(value)
}

interface Frame {
	tag: string
	bold: boolean
	italic: boolean
	underline: boolean
	color?: BodyColor
	href?: string
}

function runOf(text: string, frame: Frame): BodyRun {
	return {
		text,
		...(frame.bold ? { bold: true } : {}),
		...(frame.italic ? { italic: true } : {}),
		...(frame.underline ? { underline: true } : {}),
		...(frame.color ? { color: frame.color } : {}),
		...(frame.href ? { href: frame.href } : {}),
	}
}

export function parseNotificationBody(input: string): BodyBlock[] {
	if (!RICH_START.test(input)) {
		return [{ kind: 'paragraph', runs: [{ text: input }] }]
	}

	const text = input
		.replace(/<script\b[\s\S]*?<\/script\s*>/gi, '')
		.replace(/<style\b[\s\S]*?<\/style\s*>/gi, '')

	const blocks: BodyBlock[] = []
	const base: Frame = { tag: 'root', bold: false, italic: false, underline: false }
	const stack: Frame[] = [base]
	let runs: BodyRun[] = []
	let items: BodyRun[][] | null = null
	let ordered = false

	const top = () => stack[stack.length - 1] as Frame

	const add = (value: string) => {
		if (value !== '') runs.push(runOf(value, top()))
	}

	const closeParagraph = () => {
		if (runs.length > 0) blocks.push({ kind: 'paragraph', runs })
		runs = []
	}

	let cursor = 0

	for (const match of text.matchAll(TAG)) {
		add(decode(text.slice(cursor, match.index)))
		cursor = (match.index ?? 0) + match[0].length

		const closing = match[1] === '/'
		const name = match[2].toLowerCase()
		const found = attributes(match[3] ?? '')

		if (name === 'br') {
			add('\n')
			continue
		}

		if (name === 'p') {
			closeParagraph()
			continue
		}

		if (name === 'ul' || name === 'ol') {
			if (closing) {
				if (items) blocks.push({ kind: 'list', ordered, items })
				items = null
			} else {
				closeParagraph()
				items = []
				ordered = name === 'ol'
			}

			continue
		}

		if (name === 'li') {
			if (closing) {
				if (items && runs.length > 0) items.push(runs)
				runs = []
			}

			continue
		}

		if (closing) {
			if (top().tag === name) stack.pop()
			continue
		}

		const frame: Frame = { ...top(), tag: name }

		if (name === 'strong' || name === 'b') frame.bold = true
		else if (name === 'em' || name === 'i') frame.italic = true
		else if (name === 'u') frame.underline = true
		else if (name === 'a') {
			if (isHttps(found.href)) frame.href = found.href
		} else if (name === 'span' || name === 'font') {
			const color = colorOf(found)

			if (color) frame.color = color
		} else {
			continue
		}

		stack.push(frame)
	}

	add(decode(text.slice(cursor)))
	closeParagraph()

	if (items) blocks.push({ kind: 'list', ordered, items })

	return blocks
}

export function bodyPlainText(text: string): string {
	return parseNotificationBody(text)
		.map((block) =>
			block.kind === 'paragraph'
				? block.runs.map((run) => run.text).join('')
				: block.items
						.map((item) => item.map((run) => run.text).join(''))
						.join('\n')
		)
		.join('\n')
}
