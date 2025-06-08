import { useState } from 'react'
import { FiBook, FiDollarSign, FiSettings } from 'react-icons/fi'

import { Button } from '@/components/button/button'
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
<<<<<<< HEAD
		<WidgetContainer className={'flex flex-col gap-1 py-2'}>
			<div className="flex items-center justify-between px-2 pb-2 border-b border-content">
				<div className="flex gap-6 w-44">
=======
		<WidgetContainer className="combo-widget flex flex-col gap-1 py-2">
			<div className="flex justify-between px-4 pb-2 border-b border-gray-200/20">
				<div className="flex gap-2">
>>>>>>> c6d9a541c508f834068ac3fc29dd3277a17f91b2
					<button
						onClick={() => setActiveTab('currency')}
						className={`py-1.5 hover:opacity-70 cursor-pointer text-sm flex items-center gap-1.5 font-medium transition-all opacity-75 active:scale-95 ${activeTab === 'currency' && 'opacity-100'}`}
					>
						<FiDollarSign className="w-3.5 h-3.5" />
						<span>ارزها</span>
					</button>
					<button
						onClick={() => setActiveTab('news')}
						className={`py-1.5 hover:opacity-70 cursor-pointer text-sm flex items-center gap-1.5 font-medium transition-all opacity-75 active:scale-95 ${activeTab === 'news' && 'opacity-100'}`}
					>
						<FiBook className="w-3.5 h-3.5" />
						<span>اخبار</span>
					</button>
				</div>
				<Button
					onClick={handleSettingsClick}
					size="xs"
					className="btn-ghost"
					rounded="xl"
				>
					<FiSettings />
				</Button>
			</div>

			<div className="flex-1 overflow-hidden">
				<div className="h-full overflow-auto  [&::-webkit-scrollbar]:w-0.5">
					{activeTab === 'currency' ? (
						<WigiArzLayout
							inComboWidget={true}
							enableBackground={false}
							showSettingsModal={activeTab === 'currency' && showSettings}
							onSettingsModalClose={() => setShowSettings(false)}
						/>
					) : (
						<NewsLayout
							inComboWidget={true}
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
