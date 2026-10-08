import { t } from '@/common/i18n'
import { useState } from 'react'
import { cn } from '@/common/utils/cn'
import { SectionPanel, Tile } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { useGetUserInventory } from '@/services/market/get-user-inventory.hook'
import type { UserInventoryResponse } from '@/services/market/market.interface'
import { APPEARANCE_INVENTORY_TYPES, BUNDLED_OPTIONS, INVENTORY_LIST } from '../constants'
import { useActiveValues } from '../hooks/use-active-values'
import { useApplyItem } from '../hooks/use-apply-item'
import { useStoreItems } from '../hooks/use-store-items'
import type { AppearanceItemType, StoreItem } from '../types'
import {
	faNumber,
	inventoryItemToStoreItem,
	needsPurchase,
	uniqueByValue,
} from '../utils/store-item'
import { ItemPreview, previewAspect } from './previews/item-preview'
import { CoinAmount } from './store-item/coin-amount'
import { ItemDetailModal } from './store-item/item-detail-modal'

const STORE_PREVIEW_LIMIT = 3

interface StoreItemPickerProps {
	type: AppearanceItemType
	title: string
	description: string
	onOpenStore: () => void
}

export function StoreItemPicker({
	type,
	title,
	description,
	onOpenStore,
}: StoreItemPickerProps) {
	const { isAuthenticated } = useAuth()
	const { data: inventory } = useGetUserInventory(isAuthenticated, {
		type: APPEARANCE_INVENTORY_TYPES,
	})
	const { items } = useStoreItems()
	const active = useActiveValues()
	const apply = useApplyItem()
	const [detail, setDetail] = useState<StoreItem | null>(null)
	const [isDetailOpen, setIsDetailOpen] = useState(false)

	const ofType = items.filter((item) => item.type === type)
	const options = usableOptions(inventory, type, ofType)
	const usableValues = new Set(options.map((item) => item.value))
	const inStore = ofType.filter(
		(item) => !usableValues.has(item.value) && needsPurchase(item)
	)
	const wide = previewAspect(type) !== 'video'
	const grid = cn(
		'grid gap-2.5',
		wide
			? 'grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]'
			: 'grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))]'
	)

	const openDetail = (item: StoreItem) => {
		setDetail(item)
		setIsDetailOpen(true)
	}

	return (
		<SectionPanel
			title={title}
			size="sm"
			action={
				<button
					type="button"
					onClick={onOpenStore}
					className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg cursor-pointer text-brand hover:underline focus-visible:focus-ring"
				>
					<Icon name="shoppingBag" size={14} />
					{inStore.length > 0
						? t('market.picker.moreInStore', {
								p0: faNumber(inStore.length),
								p1: title,
							})
						: t('market.picker.storeLink')}
				</button>
			}
		>
			<p className="mb-3 text-xs text-fg-muted">{description}</p>
			<div className={grid}>
				{options.map((item) => {
					const isActive = active[type] === item.value
					return (
						<Tile
							key={item.id}
							media={<ItemPreview item={item} />}
							aspect={previewAspect(type)}
							title={item.name}
							selected={isActive}
							meta={
								isActive && (
									<span className="grid rounded-full size-5 place-items-center bg-brand text-on-brand">
										<Icon
											name="check"
											size={12}
											aria-label={t('market.picker.selectedBadge')}
										/>
									</span>
								)
							}
							onClick={() => apply(item)}
						/>
					)
				})}
			</div>

			{inStore.length > 0 && (
				<>
					<div className="flex items-center gap-2 mt-4 mb-2.5">
						<span className="font-semibold text-2xs text-fg-faint">
							{t('market.picker.freeTryHint')}
						</span>
						<span className="flex-1 h-px bg-line" />
					</div>
					<div className={grid}>
						{inStore.slice(0, STORE_PREVIEW_LIMIT).map((item) => (
							<Tile
								key={item.id}
								media={<ItemPreview item={item} />}
								aspect={previewAspect(type)}
								title={item.name}
								meta={
									item.price > 0 ? (
										<CoinAmount amount={item.price} />
									) : (
										<span className="font-semibold text-2xs text-fg">
											{t('market.itemState.free')}
										</span>
									)
								}
								overlay={
									<span className="absolute z-10 grid rounded-lg top-2 start-2 size-6 place-items-center bg-scrim text-image-fg backdrop-glass">
										<Icon
											name="lock"
											size={12}
											aria-label={t('market.picker.notOwnedHint')}
										/>
									</span>
								}
								onClick={() => openDetail(item)}
							/>
						))}
					</div>
				</>
			)}

			<ItemDetailModal
				item={detail}
				isOpen={isDetailOpen}
				onClose={() => setIsDetailOpen(false)}
			/>
		</SectionPanel>
	)
}

function usableOptions(
	inventory: UserInventoryResponse | undefined,
	type: AppearanceItemType,
	storeItems: StoreItem[]
): StoreItem[] {
	const fromInventory = (inventory?.[INVENTORY_LIST[type]] ?? []).map((item) =>
		inventoryItemToStoreItem(item, type)
	)
	return uniqueByValue([
		...BUNDLED_OPTIONS[type],
		...fromInventory,
		...storeItems.filter((item) => item.isOwned),
	])
}
