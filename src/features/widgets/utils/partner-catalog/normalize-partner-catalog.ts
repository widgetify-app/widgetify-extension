import type { PartnerWidgetKey } from '@/features/widgets/utils/layout-engine/types'
import type {
	ContactRequirement,
	PartnerCatalogItem,
	PartnerCategory,
	PartnerScope,
	PartnerSize,
	PartnerVariant,
} from '../../types'

const MAX_ITEMS = 100
const MAX_SIZES = 12
const MAX_VARIANTS = 8
const MAX_TOKENS = 40
const MAX_WIDTH = 8
const MAX_HEIGHT = 12
const FALLBACK_EMOJI = '🧩'
const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]']
const SLUG = /^[a-z0-9-]{1,40}$/
const TOKEN = /^[a-z-]{1,40}$/
const CATEGORIES: PartnerCategory[] = ['time', 'productivity', 'info', 'lifestyle']
const CONTACTS: ContactRequirement[] = ['EMAIL_OR_PHONE', 'PHONE', 'EMAIL']

type Raw = Record<string, unknown>

function isRaw(value: unknown): value is Raw {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readText(value: unknown, max: number): string | null {
	if (typeof value !== 'string') return null
	const text = value.trim()
	return text.length >= 1 && text.length <= max ? text : null
}

function isGridSize(value: unknown): value is { w: number; h: number } {
	if (!isRaw(value)) return false
	const { w, h } = value
	return (
		typeof w === 'number' &&
		typeof h === 'number' &&
		Number.isInteger(w) &&
		Number.isInteger(h) &&
		w >= 1 &&
		w <= MAX_WIDTH &&
		h >= 1 &&
		h <= MAX_HEIGHT
	)
}

function readSizes(value: unknown): PartnerSize[] {
	if (!Array.isArray(value)) return []
	const seen = new Set<string>()
	const sizes: PartnerSize[] = []

	for (const entry of value.slice(0, MAX_SIZES)) {
		if (!isGridSize(entry)) continue
		const key = `${entry.w}x${entry.h}`
		if (seen.has(key)) continue
		seen.add(key)
		const size: PartnerSize = { w: entry.w, h: entry.h }
		if ((entry as Raw).isVipOnly === true) size.isVipOnly = true
		sizes.push(size)
	}

	return sizes
}

function readVariants(value: unknown): PartnerVariant[] {
	if (!Array.isArray(value)) return []
	const seen = new Set<string>()
	const variants: PartnerVariant[] = []

	for (const entry of value.slice(0, MAX_VARIANTS)) {
		if (!isRaw(entry) || !isGridSize(entry.size)) continue
		const id = typeof entry.id === 'string' && SLUG.test(entry.id) ? entry.id : null
		const title = readText(entry.label, 60)
		if (!id || !title || seen.has(id)) continue
		seen.add(id)
		const variant: PartnerVariant = {
			id,
			title,
			size: { w: entry.size.w, h: entry.size.h },
		}
		if (entry.isVipOnly === true) variant.isVipOnly = true
		if (isRaw(entry.meta)) variant.meta = entry.meta
		variants.push(variant)
	}

	return variants
}

function readTokens(value: unknown): string[] {
	if (!Array.isArray(value)) return []
	const tokens = value.filter(
		(token): token is string => typeof token === 'string' && TOKEN.test(token)
	)
	return [...new Set(tokens)].slice(0, MAX_TOKENS)
}

function readScopes(value: unknown): PartnerScope[] {
	if (!Array.isArray(value)) return []
	const scopes = value.filter(
		(scope): scope is PartnerScope => scope === 'PROFILE' || scope === 'ACCOUNT'
	)
	return [...new Set(scopes)]
}

function readTimeout(value: unknown): number | null {
	return typeof value === 'number' &&
		Number.isInteger(value) &&
		value >= 1000 &&
		value <= 60000
		? value
		: null
}

function isSecureOrigin(url: URL): boolean {
	if (url.protocol === 'https:') return true

	return url.protocol === 'http:' && LOOPBACK_HOSTS.includes(url.hostname)
}

function readUrl(value: unknown): URL | null {
	if (typeof value !== 'string') return null
	try {
		const url = new URL(value)
		return isSecureOrigin(url) && !url.username && !url.password ? url : null
	} catch {
		return null
	}
}

function normalizeItem(raw: unknown): PartnerCatalogItem | null {
	if (!isRaw(raw) || raw.kind !== 'partner' || !isRaw(raw.partner)) return null

	const key = raw.widgetKey
	if (typeof key !== 'string' || !key.startsWith('widget:')) return null
	const slug = key.slice('widget:'.length)
	if (!SLUG.test(slug) || raw.partner.slug !== slug) return null

	const title = readText(raw.label, 60)
	const url = readUrl(raw.partner.widgetUrl)
	const allowedSizes = readSizes(raw.allowedSizes)
	if (!title || !url || allowedSizes.length === 0) return null
	if (raw.partner.origin !== url.origin) return null

	const requestedDefault = isGridSize(raw.defaultSize) ? raw.defaultSize : null
	const defaultSize =
		allowedSizes.find(
			(size) => size.w === requestedDefault?.w && size.h === requestedDefault?.h
		) ?? allowedSizes[0]

	const emoji = readText(raw.emoji, 16) ?? FALLBACK_EMOJI
	const category = CATEGORIES.includes(raw.category as PartnerCategory)
		? (raw.category as PartnerCategory)
		: 'info'
	const contact = CONTACTS.includes(
		raw.partner.contactRequirement as ContactRequirement
	)
		? (raw.partner.contactRequirement as ContactRequirement)
		: 'EMAIL_OR_PHONE'

	return {
		widgetKey: key as PartnerWidgetKey,
		slug,
		title,
		emoji,
		category,
		isVipOnly: raw.isVipOnly === true,
		isNew: raw.isNew === true,
		allowedSizes,
		defaultSize: { w: defaultSize.w, h: defaultSize.h },
		variants: readVariants(raw.variants),
		canDuplicate: raw.canDuplicate === true,
		widgetUrl: url.toString(),
		origin: url.origin,
		scopes: readScopes(raw.partner.scopes),
		contactRequirement: contact,
		allow: readTokens(raw.partner.allow),
		sandbox: readTokens(raw.partner.sandbox),
		timeoutMs: readTimeout(raw.partner.timeoutMs),
	}
}

export function normalizePartnerCatalog(raw: unknown): PartnerCatalogItem[] {
	if (!Array.isArray(raw)) return []
	const seen = new Set<string>()
	const items: PartnerCatalogItem[] = []

	for (const entry of raw) {
		const item = normalizeItem(entry)
		if (!item || seen.has(item.widgetKey)) continue
		seen.add(item.widgetKey)
		items.push(item)
		if (items.length >= MAX_ITEMS) break
	}

	return items
}

export function partnerItemsOf(catalog: unknown): Record<string, unknown>[] {
	if (!isRaw(catalog) || !Array.isArray(catalog.widgets)) return []
	return catalog.widgets.filter(
		(item): item is Record<string, unknown> => isRaw(item) && item.kind === 'partner'
	)
}
