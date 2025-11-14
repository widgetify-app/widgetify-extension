import { useState } from 'react'
import { MarketWallpaper } from './marketWallpaper'
import { MarketOtherItems } from './other-items'

type MarketTabType = 'wallpapers' | 'other'

export function MarketContainer() {
	const [activeTab, setActiveTab] = useState<MarketTabType>('other')

	const getTabStyle = (isActive: boolean) => {
		if (isActive) {
			return 'border-primary/80 text-primary font-semibold border-b-2'
		}
		return 'border-transparent text-content hover:!text-primary'
	}

	return (
		<div className="space-y-4 h-[70vh] px-2">
			<div className="border-gray-200 dark:border-gray-700">
				<ul className="flex flex-wrap text-sm font-medium text-center">
					<li className="mr-2">
						<button
							onClick={() => setActiveTab('other')}
							className={`inline-block cursor-pointer transition-all duration-200 p-2 border-b-2 rounded-t-lg ${getTabStyle(activeTab === 'other')}`}
						>
							شخصی‌سازی
						</button>
					</li>
					<li className="mr-2">
						<button
							onClick={() => setActiveTab('wallpapers')}
							className={`inline-block cursor-pointer transition-all duration-200 p-2 border-b-2 rounded-t-lg ${getTabStyle(activeTab === 'wallpapers')}`}
						>
							تصویر زمینه‌ها
						</button>
					</li>
				</ul>
			</div>

			{activeTab === 'wallpapers' ? <MarketWallpaper /> : <MarketOtherItems />}
		</div>
	)
}
