import { describe, expect, it } from 'bun:test'
import { validateLayout } from '../utils/layout-engine/validation'
import {
	type StoredWidget,
	type WidgetDefinition,
	WidgetKeys,
} from '../utils/layout-engine/types'
import type { PartnerCatalogItem } from '../types'
import {
	buildWidgetRegistry,
	partnerDefinition,
	unavailableDefinition,
	widgetTitle,
} from '../utils/partner-catalog/partner-definitions'

const node: WidgetDefinition['node'] = () => null

const nodes = { widget: () => node, preview: () => node }

const NATIVE: Record<string, WidgetDefinition> = {
	[WidgetKeys.clock]: {
		id: WidgetKeys.clock,
		label: 'widgets.registry.search.label',
		emoji: '🕐',
		icon: 'clock',
		allowedSizes: [{ w: 2, h: 1 }],
		defaultSize: { w: 2, h: 1 },
		canDuplicate: false,
		node,
	},
}

const ITEM: PartnerCatalogItem = {
	widgetKey: 'widget:pomodoro',
	slug: 'pomodoro',
	title: 'پومودورو',
	emoji: '🍅',
	category: 'productivity',
	isVipOnly: true,
	isNew: true,
	allowedSizes: [
		{ w: 2, h: 1 },
		{ w: 4, h: 2, isVipOnly: true },
	],
	defaultSize: { w: 2, h: 1 },
	variants: [{ id: 'wide', title: 'کامل', size: { w: 4, h: 2 }, isVipOnly: true }],
	canDuplicate: true,
	widgetUrl: 'https://iframes.example.test/w/pomodoro',
	origin: 'https://iframes.example.test',
	scopes: [],
	contactRequirement: 'EMAIL_OR_PHONE',
	allow: [],
	sandbox: [],
	timeoutMs: null,
}

describe('partnerDefinition', () => {
	it('turns a catalog item into a widget definition', () => {
		const definition = partnerDefinition(ITEM, nodes)

		expect(definition.id).toBe('widget:pomodoro')
		expect(definition.title).toBe('پومودورو')
		expect(definition.emoji).toBe('🍅')
		expect(definition.category).toBe('productivity')
		expect(definition.isVipOnly).toBe(true)
		expect(definition.isBeta).toBe(true)
		expect(definition.canDuplicate).toBe(true)
		expect(definition.allowedSizes).toEqual(ITEM.allowedSizes)
		expect(definition.defaultSize).toEqual({ w: 2, h: 1 })
		expect(definition.variants).toEqual([
			{
				id: 'wide',
				label: 'widgets.registry.partner.label',
				title: 'کامل',
				size: { w: 4, h: 2 },
				isVipOnly: true,
				meta: { variant: 'wide' },
			},
		])
	})

	it('puts the variant id in the meta, next to what the server sent', () => {
		const [variant] =
			partnerDefinition(
				{
					...ITEM,
					variants: [
						{
							id: 'wide',
							title: 'کامل',
							size: { w: 4, h: 2 },
							meta: { mode: 'x' },
						},
					],
				},
				nodes
			).variants ?? []

		expect(variant.meta).toEqual({ mode: 'x', variant: 'wide' })
	})

	it('gives a static preview so the catalog never starts a live frame', () => {
		expect(partnerDefinition(ITEM, nodes).previewNode).toBe(node)
	})

	it('leaves variants out when the item has none', () => {
		expect(
			partnerDefinition({ ...ITEM, variants: [] }, nodes).variants
		).toBeUndefined()
	})

	it('asks for the node by key', () => {
		const keys: string[] = []

		partnerDefinition(ITEM, {
			widget: (key) => {
				keys.push(key)
				return node
			},
			preview: () => node,
		})

		expect(keys).toEqual(['widget:pomodoro'])
	})
})

describe('unavailableDefinition', () => {
	const stored: Pick<StoredWidget, 'id' | 'size'> = {
		id: 'widget:gone',
		size: { w: 4, h: 3 },
	}

	it('accepts exactly the current size and nothing else', () => {
		const definition = unavailableDefinition(stored, node)

		expect(definition.allowedSizes).toEqual([{ w: 4, h: 3 }])
		expect(definition.defaultSize).toEqual({ w: 4, h: 3 })
		expect(definition.canDuplicate).toBe(false)
		expect(definition.label).toBe('widgets.registry.unavailable.label')
	})

	it('does not share its size with the stored widget', () => {
		const definition = unavailableDefinition(stored, node)

		expect(definition.defaultSize).not.toBe(stored.size)
	})
})

describe('buildWidgetRegistry', () => {
	it('adds the catalog items to the native registry without touching it', () => {
		const registry = buildWidgetRegistry(NATIVE, [ITEM], nodes)

		expect(Object.keys(registry).sort()).toEqual([
			WidgetKeys.clock,
			'widget:pomodoro',
		])
		expect(registry[WidgetKeys.clock]).toBe(NATIVE[WidgetKeys.clock])
		expect(Object.keys(NATIVE)).toEqual([WidgetKeys.clock])
	})

	it('keeps a native definition when a catalog key collides with it', () => {
		const registry = buildWidgetRegistry(
			{ ...NATIVE, 'widget:pomodoro': NATIVE[WidgetKeys.clock] },
			[ITEM],
			nodes
		)

		expect(registry['widget:pomodoro']).toBe(NATIVE[WidgetKeys.clock])
	})

	it('lets the layout keep a widget that has no definition', () => {
		const registry = buildWidgetRegistry(NATIVE, [], nodes)

		const layout: StoredWidget[] = [
			{
				id: 'widget:gone',
				instanceId: 'a',
				position: { col: 0, row: 0 },
				size: { w: 3, h: 3 },
			},
			{
				id: WidgetKeys.clock,
				instanceId: 'b',
				position: { col: 4, row: 0 },
				size: { w: 2, h: 1 },
			},
		]

		expect(validateLayout(layout, 8, registry)).toBe(true)
	})

	it('still checks the sizes of a widget that is in the catalog', () => {
		const registry = buildWidgetRegistry(NATIVE, [ITEM], nodes)

		const layout: StoredWidget[] = [
			{
				id: 'widget:pomodoro',
				instanceId: 'a',
				position: { col: 0, row: 0 },
				size: { w: 3, h: 3 },
			},
		]

		expect(validateLayout(layout, 8, registry)).toBe(false)
	})
})

describe('widgetTitle', () => {
	it('prefers the literal title and falls back to the translated label', () => {
		const translate = (key: string) => `t:${key}`

		expect(
			widgetTitle(
				{ title: 'پومودورو', label: 'widgets.registry.partner.label' },
				translate
			)
		).toBe('پومودورو')
		expect(widgetTitle({ label: 'widgets.registry.search.label' }, translate)).toBe(
			't:widgets.registry.search.label'
		)
	})
})
