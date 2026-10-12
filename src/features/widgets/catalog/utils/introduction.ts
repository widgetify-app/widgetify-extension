type IntroTag = 'a' | 'b' | 'strong' | 'i' | 'em' | 'u' | 'p' | 'ul' | 'ol' | 'li' | 'br'

export type IntroNode =
	| { kind: 'text'; text: string }
	| { kind: 'element'; tag: IntroTag; href: string | null; children: IntroNode[] }

interface OpenElement {
	tag: IntroTag
	node: Extract<IntroNode, { kind: 'element' }>
}

const ALLOWED: readonly IntroTag[] = [
	'a',
	'b',
	'strong',
	'i',
	'em',
	'u',
	'p',
	'ul',
	'ol',
	'li',
	'br',
]

const DROP_WITH_CONTENT = [
	'script',
	'style',
	'iframe',
	'object',
	'embed',
	'template',
	'noscript',
	'svg',
	'math',
]

const MAX_INPUT = 2000
const MAX_NODES = 200
const MAX_DEPTH = 6
const TAG_START = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/
const ATTRIBUTE =
	/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
const CONTROL_AND_SPACE = new RegExp(
	`[${String.fromCharCode(0)}-${String.fromCharCode(32)}${String.fromCharCode(127)}-${String.fromCharCode(160)}]`,
	'g'
)

const NAMED_ENTITIES: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: ' ',
}

function fromCodePoint(code: number): string {
	const isValid = Number.isInteger(code) && code >= 32 && code <= 0x10ffff
	const isSurrogate = code >= 0xd800 && code <= 0xdfff

	return isValid && !isSurrogate ? String.fromCodePoint(code) : ''
}

export function decodeEntities(text: string): string {
	return text.replace(
		/&(#x[0-9a-fA-F]{1,6}|#[0-9]{1,7}|[a-zA-Z]{2,6});/g,
		(whole, body) => {
			if (body.startsWith('#x'))
				return fromCodePoint(Number.parseInt(body.slice(2), 16))

			if (body.startsWith('#'))
				return fromCodePoint(Number.parseInt(body.slice(1), 10))

			return NAMED_ENTITIES[body.toLowerCase()] ?? whole
		}
	)
}

export function safeHref(value: string): string | null {
	const cleaned = decodeEntities(value).replace(CONTROL_AND_SPACE, '')

	try {
		const url = new URL(cleaned)

		if (url.protocol !== 'https:' || url.username || url.password) return null

		return url.toString()
	} catch {
		return null
	}
}

function hrefOf(attributes: string): string | null {
	for (const match of attributes.matchAll(ATTRIBUTE)) {
		if (match[1].toLowerCase() !== 'href') continue

		return safeHref(match[2] ?? match[3] ?? match[4] ?? '')
	}

	return null
}

function isAllowed(tag: string): tag is IntroTag {
	return (ALLOWED as readonly string[]).includes(tag)
}

export function parseIntroduction(html: string): IntroNode[] {
	const source = html.slice(0, MAX_INPUT)
	const root: IntroNode[] = []
	const open: OpenElement[] = []
	let nodes = 0
	let index = 0

	const current = () => (open.length > 0 ? open[open.length - 1].node.children : root)

	const pushText = (raw: string) => {
		const text = decodeEntities(raw)

		if (text.length === 0 || nodes >= MAX_NODES) return

		const list = current()
		const last = list[list.length - 1]

		nodes += 1

		if (last && last.kind === 'text') last.text += text
		else list.push({ kind: 'text', text })
	}

	const openElement = (tag: IntroTag, href: string | null) => {
		if (nodes >= MAX_NODES || open.length >= MAX_DEPTH) return

		const node: OpenElement['node'] = { kind: 'element', tag, href, children: [] }

		nodes += 1
		current().push(node)

		if (tag !== 'br') open.push({ tag, node })
	}

	const closeElement = (tag: IntroTag) => {
		for (let position = open.length - 1; position >= 0; position -= 1) {
			if (open[position].tag === tag) {
				open.length = position

				return
			}
		}
	}

	while (index < source.length) {
		const next = source.indexOf('<', index)

		if (next === -1) {
			pushText(source.slice(index))
			break
		}

		pushText(source.slice(index, next))

		if (source.startsWith('<!--', next)) {
			const end = source.indexOf('-->', next + 4)

			index = end === -1 ? source.length : end + 3

			continue
		}

		const match = TAG_START.exec(source.slice(next))

		if (!match) {
			pushText('<')
			index = next + 1

			continue
		}

		const [whole, closing, rawName, attributes] = match
		const name = rawName.toLowerCase()

		index = next + whole.length

		if (DROP_WITH_CONTENT.includes(name)) {
			if (closing) continue

			const close = new RegExp(`</${name}\\s*>`, 'i').exec(source.slice(index))

			index = close ? index + close.index + close[0].length : source.length

			continue
		}

		if (!isAllowed(name)) continue

		if (closing) {
			if (name !== 'br') closeElement(name)

			continue
		}

		if (name === 'a') {
			const href = hrefOf(attributes)

			if (href) openElement('a', href)

			continue
		}

		openElement(name, null)
	}

	return root
}
