import { useState } from 'react'
import Analytics from '@/analytics'
import { NotesLayout } from '../notes/notes.layout'
import { TodosLayout } from '../todos/todos'
import { TabNavigation } from '@/components/tab-navigation'
import { WidgetContainer } from '../widget-container'
import { HabitsContent } from '../habit/habits.layout'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useEffect } from 'react'
import { Icon } from '@/src/icons'

type Tab = 'todos' | 'notes' | 'rabbit'
export function YadkarWidget() {
	const [tab, setTab] = useState<Tab>('todos')

	const onChangeTab = (newTab: Tab) => {
		setTab(newTab)
		Analytics.event('yadkar_change_tab')
		setToStorage('yadkar_tab', newTab)
	}

	useEffect(() => {
		const load = async () => {
			const currentTab = await getFromStorage('yadkar_tab')
			if (currentTab) {
				setTab(currentTab as Tab)
			}
		}

		load()
	}, [])

	return (
		<WidgetContainer>
			<div className="flex flex-col h-full">
				<div className="flex-none">
					<div className="flex flex-col">
						<TabNavigation
							tabMode="advanced"
							activeTab={tab}
							onTabClick={onChangeTab}
							tabs={[
								{
									id: 'todos',
									label: 'تسک‌ها',
									icon: <Icon name="taskList" size={14} />,
								},
								{
									id: 'notes',
									label: 'یادداشت',
									icon: <Icon name="notebook" size={14} />,
								},
								{
									id: 'rabbit',
									label: 'عادت‌ها (بتا)',
									icon: <Icon name="strike" size={14} />,
								},
							]}
							size="small"
							className="w-full border-none"
						/>
					</div>
				</div>

				{tab === 'todos' ? (
					<TodosLayout />
				) : tab === 'notes' ? (
					<NotesLayout />
				) : (
					<HabitsContent />
				)}
			</div>
		</WidgetContainer>
	)
}
