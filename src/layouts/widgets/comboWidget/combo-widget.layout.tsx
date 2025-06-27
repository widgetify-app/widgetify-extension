import { useState } from 'react'
import { FiBook, FiDollarSign, FiSettings } from 'react-icons/fi'

import { Button } from '@/components/button/button'
import { NewsLayout } from '../news/news.layout'
import { WidgetContainer } from '../widget-container'
import { WigiArzLayout } from '../wigiArz/wigi_arz.layout'
import { LuNewspaper } from 'react-icons/lu'

export function ComboWidget() {
	const [activeTab, setActiveTab] = useState<'news' | 'currency'>('currency')
	const [showSettings, setShowSettings] = useState(false)
	const handleSettingsClick = () => {
		setShowSettings(true)
	}

	return (
		<WidgetContainer className={'flex flex-col gap-1'}>
			<div className="flex items-center justify-between">
				<div className="flex gap-2 w-full">
					<button
						onClick={() => setActiveTab('currency')}
						className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer rounded-[0.55rem] active:scale-95 ${
							activeTab === 'currency'
								? 'bg-primary text-white'
								: 'text-muted hover:bg-base-300'
						}
								`}
					>
						<FiDollarSign className="w-3 h-3" />
						<span>ارزها</span>
					</button>
					<button
						onClick={() => setActiveTab('news')}
						className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer rounded-[0.55rem] active:scale-95 ${
							activeTab === 'news'
								? 'bg-primary text-white'
								: 'text-muted hover:bg-base-300'
						}
								`}
					>
						<LuNewspaper className="w-3 h-3" />
						<span>اخبار</span>
					</button>
				</div>
				<Button
					onClick={handleSettingsClick}
					size="xs"
					className="ml-3 h-6 w-6 p-0 flex items-center justify-center rounded-full !border-none !shadow-none"
				>
					<FiSettings size={12} className="text-content" />
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
