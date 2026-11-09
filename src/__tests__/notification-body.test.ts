import { describe, expect, it } from 'bun:test'
import { bodyPlainText, parseNotificationBody } from '@/common/utils/notification-body'

describe('parseNotificationBody', () => {
	it('keeps a plain text as one paragraph, line breaks and all', () => {
		expect(parseNotificationBody('سلام\nدنیا <b>x</b>')).toEqual([
			{ kind: 'paragraph', runs: [{ text: 'سلام\nدنیا <b>x</b>' }] },
		])
	})

	it('reads paragraphs with bold, italic, underline, colour and a link', () => {
		const blocks = parseNotificationBody(
			'<p>سلام <strong>پررنگ</strong> <em>کج</em> <u>خط</u> <span data-color="red">قرمز</span> <a href="https://widgetify.ir/a">پیوند</a></p>'
		)

		expect(blocks).toEqual([
			{
				kind: 'paragraph',
				runs: [
					{ text: 'سلام ' },
					{ text: 'پررنگ', bold: true },
					{ text: ' ' },
					{ text: 'کج', italic: true },
					{ text: ' ' },
					{ text: 'خط', underline: true },
					{ text: ' ' },
					{ text: 'قرمز', color: 'red' },
					{ text: ' ' },
					{ text: 'پیوند', href: 'https://widgetify.ir/a' },
				],
			},
		])
	})

	it('combines styles that are nested', () => {
		expect(
			parseNotificationBody(
				'<p><strong><em><span data-color="green">x</span></em></strong></p>'
			)
		).toEqual([
			{
				kind: 'paragraph',
				runs: [{ text: 'x', bold: true, italic: true, color: 'green' }],
			},
		])
	})

	it('reads bullet and numbered lists', () => {
		expect(
			parseNotificationBody('<ul><li>الف</li><li>ب</li></ul><ol><li>اول</li></ol>')
		).toEqual([
			{ kind: 'list', ordered: false, items: [[{ text: 'الف' }], [{ text: 'ب' }]] },
			{ kind: 'list', ordered: true, items: [[{ text: 'اول' }]] },
		])
	})

	it('turns a break into a new line', () => {
		expect(parseNotificationBody('<p>یک<br>دو</p>')).toEqual([
			{ kind: 'paragraph', runs: [{ text: 'یک' }, { text: '\n' }, { text: 'دو' }] },
		])
	})

	it('decodes entities and never lets markup through as markup', () => {
		expect(
			parseNotificationBody('<p>a &amp; b &lt;script&gt; <img src=x onerror=y></p>')
		).toEqual([{ kind: 'paragraph', runs: [{ text: 'a & b <script> ' }] }])
	})

	it('drops a link that is not https, and a colour that is not one of the six', () => {
		expect(
			parseNotificationBody(
				'<p><a href="javascript:alert(1)">x</a><span data-color="pink">y</span></p>'
			)
		).toEqual([{ kind: 'paragraph', runs: [{ text: 'x' }, { text: 'y' }] }])
	})
})

describe('bodyPlainText', () => {
	it('is the text a reader sees, for counting and for the show-more rule', () => {
		expect(
			bodyPlainText('<p>سلام <strong>دنیا</strong></p><ul><li>الف</li></ul>')
		).toBe('سلام دنیا\nالف')

		expect(bodyPlainText('متن ساده')).toBe('متن ساده')
	})
})
