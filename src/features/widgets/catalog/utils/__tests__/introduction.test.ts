import { describe, expect, it } from 'bun:test'
import {
	type IntroNode,
	decodeEntities,
	parseIntroduction,
	safeHref,
} from '../introduction'

function flat(nodes: IntroNode[]): string {
	return nodes
		.map((node) =>
			node.kind === 'text'
				? node.text
				: `<${node.tag}${node.href ? ` href=${node.href}` : ''}>${flat(node.children)}</${node.tag}>`
		)
		.join('')
}

const parse = (html: string) => flat(parseIntroduction(html))

describe('parseIntroduction', () => {
	it('keeps plain text and its line breaks', () => {
		expect(parse('معرفی\nخط دوم')).toBe('معرفی\nخط دوم')
	})

	it('keeps the allowed tags', () => {
		expect(parse('<p>سلام <b>دوست</b> <em>من</em></p>')).toBe(
			'<p>سلام <b>دوست</b> <em>من</em></p>'
		)
		expect(parse('<ul><li>یک</li><li>دو</li></ul>')).toBe(
			'<ul><li>یک</li><li>دو</li></ul>'
		)
		expect(parse('a<br>b<br/>c')).toBe('a<br></br>b<br></br>c')
	})

	it('reads tags and attributes in any case', () => {
		expect(parse('<A HREF="https://example.com/x">لینک</A>')).toBe(
			'<a href=https://example.com/x>لینک</a>'
		)
		expect(parse('<B>x</B>')).toBe('<b>x</b>')
	})

	it('keeps a link with a safe https address', () => {
		expect(parse('<a href="https://widgetify.ir/guide?a=1&amp;b=2">راهنما</a>')).toBe(
			'<a href=https://widgetify.ir/guide?a=1&b=2>راهنما</a>'
		)
	})

	it('reads an address in single quotes or without quotes', () => {
		expect(parse("<a href='https://example.com'>x</a>")).toBe(
			'<a href=https://example.com/>x</a>'
		)
		expect(parse('<a href=https://example.com>x</a>')).toBe(
			'<a href=https://example.com/>x</a>'
		)
	})

	it('turns a link that is not safe into plain text', () => {
		for (const href of [
			'javascript:alert(1)',
			'JaVaScRiPt:alert(1)',
			'jav&#x61;script:alert(1)',
			'java\tscript:alert(1)',
			' javascript:alert(1)',
			'data:text/html,<script>alert(1)</script>',
			'http://example.com',
			'//example.com',
			'/relative',
			'mailto:a@example.com',
			'https://user:pass@example.com',
			'vbscript:x',
			'',
		]) {
			expect(parse(`<a href="${href}">متن</a>`)).toBe('متن')
		}

		expect(parse('<a>بدون آدرس</a>')).toBe('بدون آدرس')
	})

	it('drops every attribute but the address of a link', () => {
		const result = parseIntroduction(
			'<a href="https://example.com" onclick="alert(1)" style="x" target="_self" class="y">x</a>'
		)

		expect(result).toEqual([
			{
				kind: 'element',
				tag: 'a',
				href: 'https://example.com/',
				children: [{ kind: 'text', text: 'x' }],
			},
		])
	})

	it('drops attributes on the other tags', () => {
		expect(parse('<b onclick="alert(1)" href="https://example.com">x</b>')).toBe(
			'<b>x</b>'
		)
	})

	it('drops script, style, iframe and the like together with their content', () => {
		expect(parse('a<script>alert(1)</script>b')).toBe('ab')
		expect(parse('a<SCRIPT src=x>alert(1)</SCRIPT >b')).toBe('ab')
		expect(parse('a<style>body{display:none}</style>b')).toBe('ab')
		expect(parse('a<iframe src="https://evil.example"></iframe>b')).toBe('ab')
		expect(parse('a<object data=x></object>b')).toBe('ab')
		expect(parse('a<svg onload=alert(1)><circle/></svg>b')).toBe('ab')
		expect(parse('a<script>alert(1)')).toBe('a')
	})

	it('drops tags it does not know and keeps their text', () => {
		expect(parse('<div>خط <span>یک</span></div>')).toBe('خط یک')
		expect(parse('<img src=x onerror=alert(1)>متن')).toBe('متن')
		expect(parse('<h1>تیتر</h1>')).toBe('تیتر')
		expect(parse('<form action="https://evil.example"><input></form>x')).toBe('x')
	})

	it('drops comments', () => {
		expect(parse('a<!-- <b>x</b> -->b')).toBe('ab')
		expect(parse('a<!-- never closed')).toBe('a')
	})

	it('shows a stray angle bracket as text', () => {
		expect(parse('۲ < ۳ و ۵ > ۴')).toBe('۲ < ۳ و ۵ > ۴')
		expect(parse('a <')).toBe('a <')
	})

	it('decodes the entities it knows and leaves the rest', () => {
		expect(parse('&lt;b&gt; &amp; &quot;x&quot; &#39;y&#39; &#x41;&nbsp;z')).toBe(
			'<b> & "x" \'y\' A z'
		)
		expect(parse('&unknown; &amp')).toBe('&unknown; &amp')
	})

	it('does not turn an escaped tag into a tag', () => {
		expect(parse('&lt;script&gt;alert(1)&lt;/script&gt;')).toBe(
			'<script>alert(1)</script>'
		)
		const nodes = parseIntroduction('&lt;b&gt;x&lt;/b&gt;')

		expect(nodes).toEqual([{ kind: 'text', text: '<b>x</b>' }])
	})

	it('closes tags that were left open and ignores a closing tag with no opener', () => {
		expect(parse('<b>a<i>b')).toBe('<b>a<i>b</i></b>')
		expect(parse('a</b>b</p>')).toBe('ab')
	})

	it('closes the nearest matching open tag', () => {
		expect(parse('<b>a<i>b</b>c')).toBe('<b>a<i>b</i></b>c')
	})

	it('limits the depth and the number of nodes', () => {
		const deep = '<b>'.repeat(40) + 'x'
		const many = '<b>x</b>'.repeat(500)

		expect(parse(deep).match(/<b>/g)?.length ?? 0).toBeLessThanOrEqual(6)
		expect(parseIntroduction(many).length).toBeLessThanOrEqual(200)
	})

	it('reads only the first 2000 characters', () => {
		expect(parse('a'.repeat(5000))).toHaveLength(2000)
	})

	it('returns nothing for an empty string', () => {
		expect(parseIntroduction('')).toEqual([])
	})
})

describe('safeHref', () => {
	it('keeps an https address and returns it normalised', () => {
		expect(safeHref('https://Example.com/a?b=1')).toBe('https://example.com/a?b=1')
	})

	it('removes spaces and control characters before it reads the address', () => {
		expect(safeHref('  https://example.com/\u0001a\tb ')).toBe(
			'https://example.com/ab'
		)
	})

	it('refuses everything else', () => {
		expect(safeHref('http://example.com')).toBeNull()
		expect(safeHref('javascript:1')).toBeNull()
		expect(safeHref('')).toBeNull()
	})
})

describe('decodeEntities', () => {
	it('drops a numeric entity that is not a real character', () => {
		expect(decodeEntities('a&#0;b&#1114112;c&#xD800;d')).toBe('abcd')
	})
})
