import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { TabNavigation } from '@/components/ui'
import { Icon } from '@/icons'
import { NewsLayout } from '@widget/news/news.widget'
import { WigiArzLayout } from '@widget/wigi-arz/wigi-arz.widget'
import { WidgetContainer } from '../widget-container'
import { COMBO_TAB_LABELS, COMBO_TAB_LIST, DEFAULT_COMBO_TAB } from './constants'
import type { ComboTabType } from './types'
import { normalizeComboTab } from './utils/normalize-combo-tab'

const navigationTabs = COMBO_TAB_LIST.map((tab) => ({
	id: tab.id,
	label: tab.label,
	icon: <Icon name={tab.icon} size={14} />,
}))

export function ComboWidget() {
	const [activeTab, setActiveTab] = useState<ComboTabType>(DEFAULT_COMBO_TAB)

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

	return (
		<WidgetContainer className="flex flex-col">
			<TabNavigation
				tabMode="advanced"
				activeTab={activeTab}
				onTabClick={onTabClick}
				tabs={navigationTabs}
				size="small"
				className="flex-none w-full border-none"
			/>

			<section
				aria-label={COMBO_TAB_LABELS[activeTab]}
				className="flex-1 min-h-0 overflow-y-auto hide-scrollbar"
			>
				{activeTab === 'currency' ? (
					<WigiArzLayout inComboWidget enableBackground={false} />
				) : (
					<NewsLayout inComboWidget enableBackground={false} />
				)}
			</section>
		</WidgetContainer>
	)
}
