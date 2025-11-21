import { useEffect, useState } from 'react'
import { FaGear } from 'react-icons/fa6'
import { FiDollarSign } from 'react-icons/fi'
import { LuNewspaper } from 'react-icons/lu'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/button/button'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { NewsLayout } from '../news/news.layout'
import { WidgetContainer } from '../widget-container'
import { WigiArzLayout } from '../wigiArz/wigi_arz.layout'

export type ComboTabType = 'news' | 'currency'

export function ComboWidget() {
	const [activeTab, setActiveTab] = useState<ComboTabType | null>(null)
	const handleSettingsClick = () => {
		if (activeTab === 'currency') {
			callEvent('openWidgetsSettings', { tab: WidgetTabKeys.wigiArz })
		} else {
			callEvent('openWidgetsSettings', { tab: WidgetTabKeys.news_settings })
		}

		Analytics.event(`combo_${activeTab}_settings_opened`)
	}

	const onTabClick = (tab: ComboTabType) => {
		if (tab === activeTab) return
		setActiveTab(tab)
		setToStorage('comboTabs', tab)
		Analytics.event('combo_tab_changed', { tab })
	}

	useEffect(() => {
		async function load() {
			const tabFromStorage = await getFromStorage('comboTabs')
			if (!tabFromStorage) {
				setActiveTab('currency')
			} else {
				setActiveTab(tabFromStorage)
			}
		}

		load()
	}, [])

	if (!activeTab) return null

	return (
		<WidgetContainer className={'flex flex-col gap-1'}>
			<div className="flex items-center justify-between pb-2">
				<div className="flex w-full gap-2">
					<button
						onClick={() => onTabClick('currency')}
						className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer rounded-xl active:scale-95 ${
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
						onClick={() => onTabClick('news')}
						className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer rounded-xl active:scale-95 ${
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
				<div className="flex items-center gap-x-1">
					<Button
						onClick={handleSettingsClick}
						size="xs"
						className="h-6 w-6 p-0 flex items-center justify-center rounded-full !border-none !shadow-none"
					>
						<FaGear
							size={12}
							className="text-content opacity-70 hover:opacity-100"
						/>
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-hidden">
				<div className="h-full overflow-y-auto hide-scrollbar  [&::-webkit-scrollbar]:w-0.1">
					{activeTab === 'currency' ? (
						<WigiArzLayout inComboWidget={true} enableBackground={false} />
					) : (
						<NewsLayout inComboWidget={true} enableBackground={false} />
					)}
				</div>
			</div>
		</WidgetContainer>
	)
}
