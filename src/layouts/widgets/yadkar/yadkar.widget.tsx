import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { TabNavigation } from '@/components/ui'
import { Icon } from '@/icons'
import { HabitsContent } from '../habit/habit.widget'
import type { WidgetSize } from '../layout-engine/types'
import { NotesLayout } from '../notes/notes.widget'
import { TodosLayout } from '../todos/todos.widget'
import { WidgetContainer } from '../widget-container'
import { DEFAULT_YADKAR_TAB, YADKAR_TAB_LABELS } from './constants'
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

	return (
		<WidgetContainer>
			<div className="flex flex-col h-full">
				<TabNavigation
					tabMode="advanced"
					activeTab={tab}
					onTabClick={onChangeTab}
					tabs={[
						{
							id: 'todos',
							label: YADKAR_TAB_LABELS.todos,
							icon: <Icon name="taskList" size={14} aria-hidden="true" />,
						},
						{
							id: 'notes',
							label: YADKAR_TAB_LABELS.notes,
							icon: <Icon name="notebook" size={14} aria-hidden="true" />,
						},
						{
							id: 'habits',
							label: YADKAR_TAB_LABELS.habits,
							icon: <Icon name="strike" size={14} aria-hidden="true" />,
						},
					]}
					size="small"
					className="flex-none w-full border-none"
				/>

				<section
					aria-label={YADKAR_TAB_LABELS[tab]}
					className="flex flex-col flex-1 min-h-0"
				>
					{tab === 'todos' ? (
						<TodosLayout size={size} />
					) : tab === 'notes' ? (
						<NotesLayout size={size} />
					) : (
						<HabitsContent />
					)}
				</section>
			</div>
		</WidgetContainer>
	)
}
