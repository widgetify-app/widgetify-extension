import { describe, expect, it } from 'bun:test'
import {
	normalizePartnerCatalog,
	partnerItemsOf,
} from '../utils/partner-catalog/normalize-partner-catalog'

function serverItem(overrides: Record<string, unknown> = {}) {
	return {
		widgetKey: 'widget:pomodoro',
		label: 'پومودورو',
		emoji: '🍅',
		category: 'productivity',
		isVipOnly: false,
		isNew: true,
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 4, h: 2, isVipOnly: true },
		],
		defaultSize: { w: 2, h: 1 },
		variants: [
			{ id: 'compact', label: 'فشرده', size: { w: 2, h: 1 } },
			{ id: 'wide', label: 'کامل', size: { w: 4, h: 2 }, isVipOnly: true },
		],
		canDuplicate: false,
		kind: 'partner',
		partner: {
			slug: 'pomodoro',
			widgetUrl: 'https://iframes.example.test/w/pomodoro',
			origin: 'https://iframes.example.test',
			scopes: ['PROFILE', 'ACCOUNT'],
			contactRequirement: 'PHONE',
			allow: ['fullscreen'],
			sandbox: ['allow-scripts', 'allow-same-origin'],
			timeoutMs: 8000,
		},
		...overrides,
	}
}

function withPartner(patch: Record<string, unknown>) {
	return serverItem({
		partner: { ...serverItem().partner, ...patch },
	})
}

describe('normalizePartnerCatalog', () => {
	it('reads a complete server item', () => {
		const [item] = normalizePartnerCatalog([serverItem()])

		expect(item).toEqual({
			widgetKey: 'widget:pomodoro',
			slug: 'pomodoro',
			title: 'پومودورو',
			emoji: '🍅',
			category: 'productivity',
			isVipOnly: false,
			isNew: true,
			allowedSizes: [
				{ w: 2, h: 1 },
				{ w: 4, h: 2, isVipOnly: true },
			],
			defaultSize: { w: 2, h: 1 },
			variants: [
				{ id: 'compact', title: 'فشرده', size: { w: 2, h: 1 } },
				{ id: 'wide', title: 'کامل', size: { w: 4, h: 2 }, isVipOnly: true },
			],
			canDuplicate: false,
			widgetUrl: 'https://iframes.example.test/w/pomodoro',
			origin: 'https://iframes.example.test',
			scopes: ['PROFILE', 'ACCOUNT'],
			contactRequirement: 'PHONE',
			allow: ['fullscreen'],
			sandbox: ['allow-scripts', 'allow-same-origin'],
			timeoutMs: 8000,
		})
	})

	it('answers an empty list for anything that is not a list', () => {
		for (const raw of [null, undefined, 'x', 3, {}, { widgets: [] }]) {
			expect(normalizePartnerCatalog(raw)).toEqual([])
		}
	})

	it('drops items that are not partner widgets or are malformed', () => {
		const bad: unknown[] = [
			null,
			'x',
			serverItem({ kind: undefined }),
			serverItem({ widgetKey: 'calendar' }),
			serverItem({ widgetKey: 'widget:Bad' }),
			serverItem({ widgetKey: `widget:${'a'.repeat(41)}` }),
			serverItem({ label: '' }),
			serverItem({ label: 'x'.repeat(61) }),
			serverItem({ allowedSizes: [] }),
			serverItem({
				allowedSizes: [
					{ w: 0, h: 1 },
					{ w: 9, h: 1 },
					{ w: 2, h: 13 },
				],
			}),
			withPartner({ slug: 'other' }),
			withPartner({ widgetUrl: 'http://iframes.example.test/w/pomodoro' }),
			withPartner({ widgetUrl: 'not a url' }),
			withPartner({ widgetUrl: 'https://user:pw@iframes.example.test/w/pomodoro' }),
			withPartner({ origin: 'https://evil.example' }),
			serverItem({ partner: null }),
		]

		expect(normalizePartnerCatalog(bad)).toEqual([])
	})

	it('accepts plain http only for a page on this machine', () => {
		for (const host of ['localhost:5174', '127.0.0.1:5174', '[::1]:5174']) {
			const [item] = normalizePartnerCatalog([
				withPartner({
					widgetUrl: `http://${host}/w/actions-demo`,
					origin: `http://${host}`,
				}),
			])

			expect(item?.origin).toBe(`http://${host}`)
		}

		const remote = withPartner({
			widgetUrl: 'http://localhost.evil.example/w/x',
			origin: 'http://localhost.evil.example',
		})

		expect(normalizePartnerCatalog([remote])).toEqual([])
	})

	it('reads an item that has an empty emoji and a null icon', () => {
		const [item] = normalizePartnerCatalog([serverItem({ emoji: '', icon: null })])

		expect(item.emoji).toBe('🧩')
	})

	it('falls back to safe defaults for optional fields', () => {
		const [item] = normalizePartnerCatalog([
			serverItem({
				emoji: 3,
				category: 'weird',
				defaultSize: { w: 7, h: 7 },
				variants: 'nope',
				isVipOnly: 'yes',
				canDuplicate: 1,
			}),
		])

		expect(item.emoji).toBe('🧩')
		expect(item.category).toBe('info')
		expect(item.defaultSize).toEqual({ w: 2, h: 1 })
		expect(item.variants).toEqual([])
		expect(item.isVipOnly).toBe(false)
		expect(item.canDuplicate).toBe(false)
	})

	it('keeps only sizes, variants and tokens that are well formed', () => {
		const [item] = normalizePartnerCatalog([
			serverItem({
				allowedSizes: [
					{ w: 2, h: 1 },
					{ w: 2, h: 1 },
					{ w: 2.5, h: 1 },
					{ w: 3, h: 2, isVipOnly: 'x' },
				],
				variants: [
					{ id: 'ok', label: 'خوب', size: { w: 2, h: 1 } },
					{ id: 'ok', label: 'تکراری', size: { w: 2, h: 1 } },
					{ id: 'Bad Id', label: 'بد', size: { w: 2, h: 1 } },
					{ id: 'nolabel', label: ' ', size: { w: 2, h: 1 } },
					{ id: 'big', label: 'بزرگ', size: { w: 9, h: 1 } },
				],
			}),
		])

		expect(item.allowedSizes).toEqual([
			{ w: 2, h: 1 },
			{ w: 3, h: 2 },
		])
		expect(item.variants.map((variant) => variant.id)).toEqual(['ok'])
	})

	it('filters scopes, contact requirement, tokens and the timeout', () => {
		const [item] = normalizePartnerCatalog([
			withPartner({
				scopes: ['PROFILE', 'ADMIN', 'PROFILE'],
				contactRequirement: 'SMS',
				allow: ['fullscreen', 'Bad Token', 7, 'fullscreen'],
				sandbox: ['allow-scripts', 'allow-top-navigation;'],
				timeoutMs: 100,
			}),
		])

		expect(item.scopes).toEqual(['PROFILE'])
		expect(item.contactRequirement).toBe('EMAIL_OR_PHONE')
		expect(item.allow).toEqual(['fullscreen'])
		expect(item.sandbox).toEqual(['allow-scripts'])
		expect(item.timeoutMs).toBeNull()
	})

	it('keeps one item per key and caps the list', () => {
		expect(normalizePartnerCatalog([serverItem(), serverItem()])).toHaveLength(1)

		const many = Array.from({ length: 150 }, (_, index) =>
			serverItem({
				widgetKey: `widget:w${index}`,
				partner: { ...serverItem().partner, slug: `w${index}` },
			})
		)

		expect(normalizePartnerCatalog(many)).toHaveLength(100)
	})
})

describe('partnerItemsOf', () => {
	it('takes only the partner items of a server catalog', () => {
		const native = { widgetKey: 'calendar', label: 'تقویم' }
		const catalog = { widgets: [native, serverItem(), 'junk', null] }

		expect(partnerItemsOf(catalog)).toEqual([serverItem()])
		expect(partnerItemsOf(null)).toEqual([])
		expect(partnerItemsOf({ widgets: 'x' })).toEqual([])
	})
})
