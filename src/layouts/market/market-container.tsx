import { FaPaintBrush } from 'react-icons/fa'
import { FaPhotoFilm } from 'react-icons/fa6'
import { type TabItem, TabManager } from '@/components/tab-manager'
import { MarketWallpaper } from './marketWallpaper'
import { MarketOtherItems } from './other-items'

export function MarketContainer() {
	const tabs: TabItem[] = [
		{
			label: 'شخصی‌سازی',
			value: 'other',
			icon: <FaPaintBrush />,
			element: <MarketOtherItems />,
		},
		{
			label: 'تصویر زمینه‌ها',
			value: 'wallpapers',
			icon: <FaPhotoFilm />,
			element: <MarketWallpaper />,
		},
	]

	return (
		<TabManager
			tabOwner="user"
			tabs={tabs}
			defaultTab="other"
			direction="rtl"
			tabPosition="top"
		/>
	)
}
