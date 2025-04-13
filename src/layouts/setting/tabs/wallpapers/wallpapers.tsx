import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { useState } from 'react'

import { GalleryTab } from './tab/gallery.tab'
import { GradientTab } from './tab/gradient.tab'

export function WallpaperSetting() {
	const { theme } = useTheme()
	const [activeTab, setActiveTab] = useState<'gallery' | 'gradient'>('gallery')

	const getTabStyle = (isActive: boolean) => {
		if (isActive) {
			switch (theme) {
				case 'light':
					return 'border-blue-500 text-blue-600 font-medium'
				case 'dark':
					return 'border-blue-400 text-blue-400 font-medium'
				default: // glass
					return 'border-blue-400 text-blue-400 font-medium'
			}
		}
		switch (theme) {
			case 'light':
				return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
			case 'dark':
				return 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
			default: // glass
				return 'border-transparent text-gray-400 hover:text-gray-300 hover:border-white/20'
		}
	}

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			{/* Main tabs navigation */}
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
		</motion.div>
	)
}
