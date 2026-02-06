import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/button/button'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { NewsLayout } from '../news/news.layout'
import { WidgetContainer } from '../widget-container'
import { WigiArzLayout } from '../wigiArz/wigi_arz.layout'
import { TabNavigation } from '@/components/tab-navigation'
import { HiOutlineCurrencyBangladeshi, HiOutlineNewspaper } from 'react-icons/hi2'
import { CgOptions } from 'react-icons/cg'

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
		<WidgetContainer className={'flex flex-col'}>
			<div className="flex-none">
				<TabNavigation
					tabMode="advanced"
					activeTab={activeTab}
					onTabClick={onTabClick}
					tabs={[
						{
							id: 'currency',
							label: 'ارزها',
							icon: <HiOutlineCurrencyBangladeshi size={14} />,
						},
						{
							id: 'news',
							label: 'اخبار',
							icon: <HiOutlineNewspaper size={14} />,
						},
					]}
					size="small"
					className="w-full"
				/>
				<div className="flex justify-end my-1">
					<Button
						size="sm"
						onClick={handleSettingsClick}
						className={`px-2 py-0! border-none! rounded-xl text-base-content/40 shrink-0 active:scale-95 h-7!`}
					>
						<CgOptions className="w-4 h-4" />
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
