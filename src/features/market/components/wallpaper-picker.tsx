import { type ReactNode, useState } from 'react'
import { useActiveValues } from '../hooks/use-active-values'
import { useApplyItem } from '../hooks/use-apply-item'
import type { StoreItem } from '../types'
import { needsPurchase } from '../utils/store-item'
import { ItemDetailModal } from './store-item/item-detail-modal'
import { WallpaperBrowser } from './wallpaper-browser'

export function WallpaperPicker({ leading }: { leading?: ReactNode }) {
	const active = useActiveValues()
	const apply = useApplyItem()
	const [detail, setDetail] = useState<StoreItem | null>(null)
	const [isDetailOpen, setIsDetailOpen] = useState(false)
	const activeId = active.WALLPAPER ?? null

	const pick = (item: StoreItem) => {
		if (item.id === activeId) return
		if (needsPurchase(item)) {
			setDetail(item)
			setIsDetailOpen(true)
			return
		}
		apply(item)
	}

	return (
		<>
			<WallpaperBrowser selectedId={activeId} onPick={pick} leading={leading} />
			<ItemDetailModal
				item={detail}
				isOpen={isDetailOpen}
				onClose={() => setIsDetailOpen(false)}
			/>
		</>
	)
}
