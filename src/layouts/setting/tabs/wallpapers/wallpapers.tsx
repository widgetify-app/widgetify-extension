import { useState } from 'react'

import { GalleryTab } from './tab/gallery/gallery.tab'
import { GradientTab } from './tab/gradient.tab'

export function WallpaperSetting() {
	const [activeTab, setActiveTab] = useState<'gallery' | 'gradient'>('gallery')

	const getTabStyle = (isActive: boolean) => {
		if (isActive) {
			return 'border-primary/80 text-primary font-semibold border-b-2'
		}

		return 'border-transparent text-content hover:!text-primary'
	}

	return (
		<div className="w-full max-w-xl mx-auto">
			<div className="mb-4 border-gray-200 dark:border-gray-700">
				<ul className="flex flex-wrap text-sm font-medium text-center">
					<li className="mr-2">
						<button
							onClick={() => setActiveTab('gallery')}
							className={`inline-block cursor-pointer p-4 border-b-2 rounded-t-lg ${getTabStyle(activeTab === 'gallery')}`}
						>
							تصاویر
						</button>
					</li>
					<li className="mr-2">
						<button
							onClick={() => setActiveTab('gradient')}
							className={`inline-block cursor-pointer p-4 border-b-2 rounded-t-lg ${getTabStyle(activeTab === 'gradient')}`}
						>
							گرادیان
						</button>
					</li>
				</ul>
			</div>

			<div className="flex flex-col gap-4">
				{activeTab === 'gallery' ? <GalleryTab /> : <GradientTab />}
			</div>
		</div>
	)
}
