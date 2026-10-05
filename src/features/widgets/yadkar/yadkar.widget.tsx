import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { WidgetHeaderTabs } from '../components/widget-header'
import { HabitsContent } from '../habit/habit.widget'
import type { WidgetSize } from '../utils/layout-engine/types'
import { NotesLayout } from '../notes/notes.widget'
import { TodosLayout } from '../todos/todos.widget'
import { WidgetContainer } from '../components/widget-container'
import { DEFAULT_YADKAR_TAB, YADKAR_TAB_LABELS, YADKAR_TAB_LIST } from './constants'
import type { YadkarTab } from './types'
import { normalizeYadkarTab } from './utils/normalize-yadkar-tab'

interface YadkarWidgetProps {
	size?: WidgetSize
}

export function YadkarWidget({ size }: YadkarWidgetProps = {}) {
	const [tab, setTab] = useState<YadkarTab>(DEFAULT_YADKAR_TAB)

	useEffect(() => {
		async function load() {
			const storedTab = await getFromStorage('yadkar_tab')
			setTab(normalizeYadkarTab(storedTab))
		}

		load()
	}, [])

	const onChangeTab = (newTab: YadkarTab) => {
		if (newTab === tab) return
		setTab(newTab)
		setToStorage('yadkar_tab', newTab)
		Analytics.event('yadkar_change_tab', { tab: newTab })
	}

	const tabs = (
		<WidgetHeaderTabs
			label="یادکار"
			tabs={YADKAR_TAB_LIST}
			activeTab={tab}
			onChange={onChangeTab}
		/>
	)

	return (
		<WidgetContainer contentClassName="p-3">
			<section
				aria-label={YADKAR_TAB_LABELS[tab]}
				className="flex flex-col flex-1 min-h-0 gap-2"
			>
				{tab === 'todos' ? (
					<TodosLayout size={size} tabs={tabs} />
				) : tab === 'notes' ? (
					<NotesLayout size={size} tabs={tabs} />
				) : (
					<HabitsContent size={size} tabs={tabs} />
				)}
			</section>
		</WidgetContainer>
	)
}
