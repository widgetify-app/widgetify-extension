import { useState } from 'react'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { useWallpaperContext } from '@/context/wallpaper.context'
import { safeAwait } from '@/services/api'
import { usePurchaseMarketItem } from '@/services/market/purchase-market-item.hook'
import type { StoreItem } from '../types'

export function useBuyItem() {
	const { mutateAsync: purchase } = usePurchaseMarketItem()
	const { handleSelectBackground } = useWallpaperContext()
	const [isBuying, setIsBuying] = useState(false)

	const buy = async (item: StoreItem): Promise<boolean> => {
		Analytics.event('market_item_purchase_started')
		setIsBuying(true)
		const bought = await buyOnce(item)
		setIsBuying(false)
		return bought
	}

	const buyOnce = async (item: StoreItem): Promise<boolean> => {
		if (item.wallpaper) return handleSelectBackground(item.wallpaper)

		const [error] = await safeAwait(purchase({ itemId: item.id }))
		if (error) {
			Analytics.event('market_item_purchase_failed')
			showToast(
				(translateError(error) as string) || 'خرید انجام نشد، دوباره امتحان کن',
				'error'
			)
			return false
		}
		Analytics.event('market_item_purchased')
		return true
	}

	return { buy, isBuying }
}
