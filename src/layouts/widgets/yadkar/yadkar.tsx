import { useState } from 'react'
import Analytics from '@/analytics'
import { NotesLayout } from '../notes/notes.layout'
import { TodosLayout } from '../todos/todos'
import { TabNavigation } from '@/components/tab-navigation'
import { HiOutlineCheckCircle, HiOutlineDocumentText } from 'react-icons/hi2'
import { WidgetContainer } from '../widget-container'

export function YadkarWidget() {
	const [tab, setTab] = useState<'todos' | 'notes'>('todos')

	const onChangeTab = (newTab: 'todos' | 'notes') => {
		setTab(newTab)
		Analytics.event('yadkar_change_tab')
	}

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
									label: 'وظایف',
									icon: <HiOutlineCheckCircle size={14} />,
								},
								{
									id: 'notes',
									label: 'یادداشت',
									icon: <HiOutlineDocumentText size={14} />,
								},
							]}
							size="small"
							className="w-full"
						/>
					</div>
				</div>

				{tab === 'todos' ? <TodosLayout /> : <NotesLayout />}
			</div>
		</WidgetContainer>
	)
}
