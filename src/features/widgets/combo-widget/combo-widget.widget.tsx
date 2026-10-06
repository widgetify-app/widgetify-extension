import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { PopoverMenuItem } from '@/components/ui'
import { NewsComboView } from '@/features/widgets/news/news.widget'
import { WigiArzComboView } from '@/features/widgets/wigi-arz/wigi-arz.widget'
import { Icon } from '@/icons'
import { useRefreshCurrencies } from '@/services/currency/get-currency-by-code.hook'
import { useRefreshRssFeeds } from '@/services/news/get-news.hook'
import { WidgetContainer } from '../components/widget-container'
import { WidgetHeaderTabs } from '../components/widget-header'
import { useWidgetMenuActions, useWidgetSettingsSummary } from '../widget-menu.context'
import { COMBO_TAB_LIST, DEFAULT_COMBO_TAB } from './constants'
import type { ComboTabType } from './types'
import { normalizeComboTab } from './utils/normalize-combo-tab'

export function ComboWidget() {
	const [activeTab, setActiveTab] = useState<ComboTabType>(DEFAULT_COMBO_TAB)
	const { refresh: refreshCurrencies } = useRefreshCurrencies()
	const { refresh: refreshNews } = useRefreshRssFeeds()

	useWidgetSettingsSummary('ارزها و منابع خبری')
	useWidgetMenuActions(
		<PopoverMenuItem
			icon={<Icon name="refresh" size={14} />}
			label="به‌روز کن"
			onClick={activeTab === 'currency' ? refreshCurrencies : refreshNews}
		/>
	)

	useEffect(() => {
		async function load() {
			const storedTab = await getFromStorage('comboTabs')
			setActiveTab(normalizeComboTab(storedTab))
		}

		load()
	}, [])

	const onTabClick = (tab: ComboTabType) => {
		if (tab === activeTab) return
		setActiveTab(tab)
		setToStorage('comboTabs', tab)
		Analytics.event('combo_tab_changed', { tab })
	}

	const tabs = (
		<WidgetHeaderTabs
			label="ارز و اخبار"
			tabs={COMBO_TAB_LIST}
			activeTab={activeTab}
			onChange={onTabClick}
		/>
	)

	return (
		<WidgetContainer contentClassName="p-3 gap-2">
			{activeTab === 'currency' ? (
				<WigiArzComboView tabs={tabs} />
			) : (
				<NewsComboView tabs={tabs} />
			)}
		</WidgetContainer>
	)
}
