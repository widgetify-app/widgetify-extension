import { t } from '@/common/i18n'
import { useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { listenEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { useGetWallpaperCategories } from '@/services/wallpapers/get-wallpaper-categories.hook'
import { CategoryView } from './components/category-view'
import { ItemDetail } from './components/store-item/item-detail'
import { StoreNav } from './components/store-nav'
import { useStoreItems } from './hooks/use-store-items'
import { MarketCoins } from './market-coins/market-coins'
import { MarketWallpaper } from './market-wallpaper/market-wallpaper'
import { StoreTryOnProvider } from './store-try-on.context'
import { Storefront } from './storefront/storefront'
import type { StoreItem, StoreView } from './types'
import { toStoreTarget } from './utils/store-item'

export { StoreItemPicker } from './components/store-item-picker'
export { WallpaperPicker } from './components/wallpaper-picker'

interface MarketContainerProps {
	initialTab?: string
	initialFilter?: string
	onStepAside: (aside: boolean) => void
	onClose: () => void
}

export function MarketContainer({
	initialTab,
	initialFilter,
	onStepAside,
	onClose,
}: MarketContainerProps) {
	const [view, setView] = useState<StoreView>(
		() => toStoreTarget(initialTab, initialFilter).view
	)
	const [petKind, setPetKind] = useState(
		() => toStoreTarget(initialTab, initialFilter).petKind
	)
	const [detail, setDetail] = useState<StoreItem | null>(null)
	const scrollRef = useRef<HTMLDivElement>(null)
	const { items } = useStoreItems()
	const { data: folders } = useGetWallpaperCategories()

	const navigate = (next: StoreView) => {
		setView(next)
		setDetail(null)
		scrollRef.current?.scrollTo({ top: 0 })
		Analytics.event(`market_select_tab_${next}`)
	}

	const openDetail = (item: StoreItem) => {
		Analytics.event('market_item_previewed')
		setDetail(item)
	}

	useEffect(() => {
		const target = toStoreTarget(initialTab, initialFilter)
		setView(target.view)
		setPetKind(target.petKind)
		setDetail(null)
	}, [initialTab, initialFilter])

	useEffect(
		() =>
			listenEvent('market_change_tab', (tab) => navigate(toStoreTarget(tab).view)),
		[]
	)

	const detailItem = detail && (items.find((item) => item.id === detail.id) ?? detail)
	const selectedId = detailItem?.id ?? null
	const hasNew: StoreView[] = folders.categories.some((folder) => folder.hasNewContent)
		? ['WALLPAPER']
		: []

	return (
		<StoreTryOnProvider onStepAside={onStepAside} onClose={onClose}>
			<div className="flex gap-4 h-[80vh] max-md:flex-col">
				<StoreNav view={view} hasNew={hasNew} onChange={navigate} />

				<div className="relative flex flex-1 min-w-0 min-h-0 gap-4">
					<div
						ref={scrollRef}
						className={cn(
							'flex-1 min-w-0 pb-2 overflow-x-hidden overflow-y-auto pe-1',
							detailItem && 'max-lg:hidden'
						)}
					>
						{view === 'home' && (
							<Storefront
								selectedId={selectedId}
								onOpen={openDetail}
								onNavigate={navigate}
							/>
						)}
						{view === 'wallet' && <MarketCoins />}
						{view === 'WALLPAPER' && (
							<MarketWallpaper
								selectedId={selectedId}
								onOpen={openDetail}
							/>
						)}
						{(view === 'THEME' ||
							view === 'FONT' ||
							view === 'BROWSER_TITLE' ||
							view === 'PET') && (
							<CategoryView
								key={view}
								type={view}
								defaultPetKind={petKind}
								selectedId={selectedId}
								onOpen={openDetail}
							/>
						)}
					</div>

					{detailItem && (
						<aside
							aria-label={t('market.page.itemDetailTitle')}
							className="overflow-y-auto shrink-0 w-76 ps-4 border-s border-surface-3 max-lg:flex-1 max-lg:ps-0 max-lg:border-0"
						>
							<div className="max-lg:max-w-md max-lg:mx-auto">
								<ItemDetail
									key={detailItem.id}
									item={detailItem}
									onClose={() => setDetail(null)}
									onSeeAllPackages={() => navigate('wallet')}
								/>
							</div>
						</aside>
					)}
				</div>
			</div>
		</StoreTryOnProvider>
	)
}
