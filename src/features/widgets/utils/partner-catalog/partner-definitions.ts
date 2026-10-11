import type {
	PartnerWidgetKey,
	StoredWidget,
	WidgetDefinition,
	WidgetVariantOption,
} from '@/features/widgets/utils/layout-engine/types'
import type { PartnerCatalogItem } from '../../types'

export interface PartnerNodes {
	widget: (key: PartnerWidgetKey) => WidgetDefinition['node']
	preview: (item: PartnerCatalogItem) => WidgetDefinition['node']
}

const UNAVAILABLE_EMOJI = '🧩'

function variantOption(
	variant: PartnerCatalogItem['variants'][number]
): WidgetVariantOption {
	return {
		id: variant.id,
		label: 'widgets.registry.partner.label',
		title: variant.title,
		size: variant.size,
		isVipOnly: variant.isVipOnly,
		meta: { ...variant.meta, variant: variant.id },
	}
}

export function partnerDefinition(
	item: PartnerCatalogItem,
	nodes: PartnerNodes
): WidgetDefinition {
	return {
		id: item.widgetKey,
		label: 'widgets.registry.partner.label',
		title: item.title,
		emoji: item.emoji,
		icon: 'globe',
		iconUrl: item.iconUrl,
		category: item.category,
		isVipOnly: item.isVipOnly,
		isBeta: item.isNew,
		allowedSizes: item.allowedSizes,
		defaultSize: item.defaultSize,
		variants: item.variants.length > 0 ? item.variants.map(variantOption) : undefined,
		canDuplicate: item.canDuplicate,
		node: nodes.widget(item.widgetKey),
		previewNode: nodes.preview(item),
	}
}

export function unavailableDefinition(
	widget: Pick<StoredWidget, 'id' | 'size'>,
	node: WidgetDefinition['node']
): WidgetDefinition {
	const size = { w: widget.size.w, h: widget.size.h }

	return {
		id: widget.id,
		label: 'widgets.registry.unavailable.label',
		emoji: UNAVAILABLE_EMOJI,
		icon: 'globe',
		allowedSizes: [size],
		defaultSize: size,
		canDuplicate: false,
		node,
	}
}

export function buildWidgetRegistry(
	native: Record<string, WidgetDefinition>,
	items: PartnerCatalogItem[],
	nodes: PartnerNodes
): Record<string, WidgetDefinition> {
	const registry: Record<string, WidgetDefinition> = { ...native }

	for (const item of items) {
		if (!(item.widgetKey in native)) {
			registry[item.widgetKey] = partnerDefinition(item, nodes)
		}
	}

	return registry
}

export function widgetTitle(
	definition: Pick<WidgetDefinition, 'title' | 'label'>,
	translate: (key: WidgetDefinition['label']) => string
): string {
	return definition.title ?? translate(definition.label)
}
