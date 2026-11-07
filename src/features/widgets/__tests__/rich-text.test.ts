import { describe, expect, it } from 'bun:test'
import {
	isRichText,
	parseRichText,
	richTextToPlain,
	toggleChecklistItem,
} from '../utils/rich-text'

const PHONE_SAMPLE = [
	'**مهم** و *کج* و ساده',
	'',
	'- شیر',
	'- نون',
	'',
	'1. اول',
	'2. دوم',
	'',
	'- [ ] زنگ بزن به مامان',
	'- [x] قبض رو بده',
].join('\n')

describe('parseRichText', () => {
	it('reads the phone sample as a paragraph and three lists', () => {
		const blocks = parseRichText(PHONE_SAMPLE)
		expect(blocks.map((block) => block.kind)).toEqual([
			'paragraph',
			'list',
			'list',
			'list',
		])
		expect(blocks[0]).toEqual({
			kind: 'paragraph',
			runs: [
				{ text: 'مهم', bold: true, italic: false },
				{ text: ' و ', bold: false, italic: false },
				{ text: 'کج', bold: false, italic: true },
				{ text: ' و ساده', bold: false, italic: false },
			],
		})
		expect(blocks[1]).toMatchObject({ style: 'bullet' })
		expect(blocks[2]).toMatchObject({ style: 'number' })
		expect(blocks[3]).toMatchObject({ style: 'check' })
	})

	it('keeps open and done checklist items apart', () => {
		const checklist = parseRichText(PHONE_SAMPLE)[3]
		if (checklist.kind !== 'list') throw new Error('not a list')
		expect(checklist.items.map((item) => item.checked)).toEqual([false, true])
		expect(checklist.items[0].runs[0].text).toBe('زنگ بزن به مامان')
	})

	it('keeps a single line break inside the paragraph', () => {
		const blocks = parseRichText('خط اول\nخط دوم')
		expect(blocks).toEqual([
			{
				kind: 'paragraph',
				runs: [{ text: 'خط اول\nخط دوم', bold: false, italic: false }],
			},
		])
	})

	it('splits paragraphs on a blank line', () => {
		expect(parseRichText('الف\n\nب')).toHaveLength(2)
	})

	it('reads bold and italic together', () => {
		expect(parseRichText('***x***')[0]).toEqual({
			kind: 'paragraph',
			runs: [{ text: 'x', bold: true, italic: true }],
		})
	})

	it('reads italic inside bold', () => {
		const block = parseRichText('**a *b* c**')[0]
		if (block.kind !== 'paragraph') throw new Error('not a paragraph')
		expect(block.runs.map((run) => [run.text, run.bold, run.italic])).toEqual([
			['a ', true, false],
			['b', true, true],
			[' c', true, false],
		])
	})

	it('returns nothing for an empty string', () => {
		expect(parseRichText('')).toEqual([])
	})

	it('leaves a lone star as text', () => {
		const block = parseRichText('5 * 3 = 15')[0]
		expect(block).toEqual({
			kind: 'paragraph',
			runs: [{ text: '5 * 3 = 15', bold: false, italic: false }],
		})
	})

	it('leaves a line with only a dash as text', () => {
		expect(parseRichText('- ')[0].kind).toBe('paragraph')
		expect(parseRichText('-')[0].kind).toBe('paragraph')
	})

	it('shows markup that looks like HTML as text', () => {
		expect(parseRichText('<b>x</b>')[0]).toEqual({
			kind: 'paragraph',
			runs: [{ text: '<b>x</b>', bold: false, italic: false }],
		})
	})

	it('reads a Persian bullet that starts with an English word', () => {
		const block = parseRichText('- Apple بخر')[0]
		if (block.kind !== 'list') throw new Error('not a list')
		expect(block.items[0].runs[0].text).toBe('Apple بخر')
	})

	it('reads Windows line endings', () => {
		expect(parseRichText('- الف\r\n- ب')).toHaveLength(1)
	})
})

describe('isRichText', () => {
	it('is true for marks and lists', () => {
		expect(isRichText('**a**')).toBe(true)
		expect(isRichText('*a*')).toBe(true)
		expect(isRichText('- a')).toBe(true)
		expect(isRichText('1. a')).toBe(true)
		expect(isRichText('- [ ] a')).toBe(true)
	})

	it('is false for plain text', () => {
		expect(isRichText('')).toBe(false)
		expect(isRichText('یک متن ساده\nبا دو خط')).toBe(false)
		expect(isRichText('5 * 3 = 15')).toBe(false)
		expect(isRichText('snake_case_name')).toBe(false)
		expect(isRichText('- ')).toBe(false)
		expect(isRichText('<b>x</b>')).toBe(false)
		expect(isRichText('https://example.com/a-b')).toBe(false)
	})
})

describe('richTextToPlain', () => {
	it('drops the marks and signs the lists', () => {
		expect(richTextToPlain(PHONE_SAMPLE)).toBe(
			'مهم و کج و ساده • شیر • نون 1. اول 2. دوم ☐ زنگ بزن به مامان ☑ قبض رو بده'
		)
	})

	it('hands plain text back untouched', () => {
		expect(richTextToPlain('')).toBe('')
		expect(richTextToPlain('خط اول\nخط دوم')).toBe('خط اول\nخط دوم')
		expect(richTextToPlain('5 * 3 = 15')).toBe('5 * 3 = 15')
		expect(richTextToPlain('snake_case_name')).toBe('snake_case_name')
		expect(richTextToPlain('<b>x</b>')).toBe('<b>x</b>')
	})
})

describe('toggleChecklistItem', () => {
	const list = '- [ ] a\n- [x] b\n\nنوشته\n\n- [ ] c'

	it('ticks an open item by its position', () => {
		expect(toggleChecklistItem(list, 0)).toBe('- [x] a\n- [x] b\n\nنوشته\n\n- [ ] c')
		expect(toggleChecklistItem(list, 2)).toBe('- [ ] a\n- [x] b\n\nنوشته\n\n- [x] c')
	})

	it('unticks a done item', () => {
		expect(toggleChecklistItem(list, 1)).toBe('- [ ] a\n- [ ] b\n\nنوشته\n\n- [ ] c')
	})

	it('leaves the text alone when the position is missing', () => {
		expect(toggleChecklistItem(list, 5)).toBe(list)
		expect(toggleChecklistItem('- a', 0)).toBe('- a')
	})
})
