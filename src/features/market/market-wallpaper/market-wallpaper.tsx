import { t } from '@/common/i18n'
import { CategoryHeader } from '../components/category-header'
import { WallpaperBrowser } from '../components/wallpaper-browser'
import type { StoreItem } from '../types'

interface MarketWallpaperProps {
	selectedId: string | null
	onOpen: (item: StoreItem) => void
}

export function MarketWallpaper({ selectedId, onOpen }: MarketWallpaperProps) {
	return (
		<>
			<CategoryHeader
				title={t('market.wallpaperBrowser.wallpaperLabel')}
				description={t('market.wallpaperPage.introBody')}
			/>
			<WallpaperBrowser
				defaultAccess="coin"
				selectedId={selectedId}
				onPick={onOpen}
			/>
		</>
	)
}
