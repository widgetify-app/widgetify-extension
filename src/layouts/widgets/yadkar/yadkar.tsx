import { useState } from 'react'
import Analytics from '@/analytics'
import { NotesLayout } from '../notes/notes.layout'
import { TodosLayout } from '../todos/todos'
import { TabNavigation } from '@/components/tab-navigation'
import {
	HiOutlineCheckCircle,
	HiOutlineDocumentText,
	HiOutlineFire,
} from 'react-icons/hi2'
import { WidgetContainer } from '../widget-container'
import { HabitsContent } from '../habit/habits.layout'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useEffect } from 'react'

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
									icon: <HiOutlineCheckCircle size={14} />,
								},
								{
									id: 'notes',
									label: 'یادداشت',
									icon: <HiOutlineDocumentText size={14} />,
								},
								{
									id: 'rabbit',
									label: 'عادت‌ها (بتا)',
									icon: <HiOutlineFire size={14} />,
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
