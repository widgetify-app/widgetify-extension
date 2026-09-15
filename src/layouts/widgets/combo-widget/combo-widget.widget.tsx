import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { Button, TabNavigation } from '@/components/ui'
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

	const handleSettingsClick = () => {
		const tab = COMBO_TAB_LIST.find((item) => item.id === activeTab)
		if (!tab) return

		callEvent('openWidgetsSettings', { tab: tab.settingsTab })
		Analytics.event(`combo_${activeTab}_settings_opened`)
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

			<Button
				size="sm"
				rounded="xl"
				onClick={handleSettingsClick}
				aria-label={`تنظیمات ${COMBO_TAB_LABELS[activeTab]}`}
				className="px-2 py-0! border-none! text-muted opacity-60 hover:opacity-100 shrink-0 active:scale-95 h-7!"
			>
				<Icon name="menuOption" className="w-4 h-4" aria-hidden="true" />
			</Button>
		</WidgetContainer>
	)
}
