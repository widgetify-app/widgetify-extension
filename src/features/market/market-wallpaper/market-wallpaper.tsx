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
				title="تصویر زمینه"
				description="پس‌زمینه‌ی صفحه‌ت. متحرک‌ها علامت پخش دارن و وقتی موس روشونه پخش می‌شن."
			/>
			<WallpaperBrowser
				defaultAccess="coin"
				selectedId={selectedId}
				onPick={onOpen}
			/>
		</>
	)
}
