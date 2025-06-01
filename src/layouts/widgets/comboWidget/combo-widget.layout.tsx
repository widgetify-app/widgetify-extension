import { useState } from 'react'
import { FiBook, FiDollarSign, FiSettings } from 'react-icons/fi'

import { NewsLayout } from '../news/news.layout'
import { WidgetContainer } from '../widget-container'
import { WigiArzLayout } from '../wigiArz/wigi_arz.layout'

export function ComboWidget() {
	const [activeTab, setActiveTab] = useState<'news' | 'currency'>('currency')
	const [showSettings, setShowSettings] = useState(false)
	const handleSettingsClick = () => {
		setShowSettings(true)
	}

	return (
		<WidgetContainer className="combo-widget flex flex-col gap-1 py-2">
			<div className="flex justify-between px-4 pb-2 border-b border-gray-200/20">
				<div className="flex gap-2">
					<button
						onClick={() => setActiveTab('currency')}
						className={`py-1.5 px-3 hover:opacity-70 cursor-pointer text-sm flex items-center gap-1.5 font-medium transition-all opacity-75 active:scale-95 ${activeTab === 'currency' && 'opacity-100'}`}
					>
						<FiDollarSign className="w-3.5 h-3.5" />
						<span>ارزها</span>
					</button>
					<button
						onClick={() => setActiveTab('news')}
						className={`py-1.5 px-3 hover:opacity-70 cursor-pointer text-sm flex items-center gap-1.5 font-medium transition-all opacity-75 active:scale-95 ${activeTab === 'news' && 'opacity-100'}`}
					>
						<FiBook className="w-3.5 h-3.5" />
						<span>اخبار</span>
					</button>
				</div>

				<button
					onClick={handleSettingsClick}
					className="p-1.5 rounded-full cursor-pointer hover:bg-gray-500/10 active:scale-95 transition-transform"
				>
					<FiSettings className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
				</button>
			</div>

			<div className="flex-1 overflow-hidden">
				<div className="h-full overflow-auto">
					{activeTab === 'currency' ? (
						<WigiArzLayout
							inComboWidget={true}
							enableHeader={false}
							enableBackground={false}
							showSettingsModal={activeTab === 'currency' && showSettings}
							onSettingsModalClose={() => setShowSettings(false)}
						/>
					) : (
						<NewsLayout
							inComboWidget={true}
							enableHeader={false}
							enableBackground={false}
							showSettingsModal={activeTab === 'news' && showSettings}
							onSettingsModalClose={() => setShowSettings(false)}
						/>
					)}
				</div>
			</div>
		</WidgetContainer>
	)
}
