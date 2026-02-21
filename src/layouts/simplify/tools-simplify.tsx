import Analytics from '@/analytics'
import { WidgetContainer } from '../widgets/widget-container'
import { TabNavigation } from '@/components/tab-navigation'
import {
	HiOutlineCheckCircle,
	HiOutlineDocumentText,
	HiOutlineNewspaper,
} from 'react-icons/hi2'
import { MdOutlineCalendarMonth, MdOutlineNetworkWifi, MdPets } from 'react-icons/md'
import { HiOutlineCurrencyBangladeshi } from 'react-icons/hi'
import React, { useState, Suspense } from 'react'
import { DateProvider } from '@/context/date.context'

const Calendar = React.lazy(() =>
	import('./widgets/calendar-simplify').then((module) => ({
		default: module.SimplifyCalendar,
	}))
)

const NetworkSimplify = React.lazy(() =>
	import('./widgets/network-simplify').then((module) => ({
		default: module.NetworkSimplify,
	}))
)

const TodosLayout = React.lazy(() =>
	import('../widgets/todos/todos-with-provider').then((module) => ({
		default: module.TodosWithProvider,
	}))
)

const NotesLayout = React.lazy(() =>
	import('../widgets/notes/notes.layout').then((module) => ({
		default: module.NotesLayout,
	}))
)

const ArzSimplify = React.lazy(() =>
	import('./widgets/arz-simplify').then((module) => ({
		default: module.ArzSimplify,
	}))
)

const NewsSimplify = React.lazy(() =>
	import('./widgets/news-simplify').then((module) => ({
		default: module.NewsSimplify,
	}))
)

const tabs = [
	{
		id: 'todos',
		label: 'وظایف',
		icon: <HiOutlineCheckCircle />,
		element: TodosLayout,
	},
	{
		id: 'notes',
		label: 'یادداشت',
		icon: <HiOutlineDocumentText />,
		element: NotesLayout,
	},
	{
		id: 'calendar',
		label: 'تقویم',
		icon: <MdOutlineCalendarMonth />,
		element: Calendar,
	},

	{
		id: 'currency',
		label: 'ارزها',
		icon: <HiOutlineCurrencyBangladeshi />,
		element: ArzSimplify,
	},
	{
		id: 'news',
		label: 'اخبار',
		icon: <HiOutlineNewspaper />,
		element: NewsSimplify,
	},
	{
		id: 'network',
		label: 'شبکه',
		icon: <MdOutlineNetworkWifi />,
		element: NetworkSimplify,
	},
]

type TabId = string

export function SimpleTools() {
	const [tab, setTab] = useState<TabId>('calendar')

	const onChangeTab = (newTab: TabId) => {
		setTab(newTab)
		Analytics.event('yadkar_change_tab')
	}

	const ElementData = tabs.find((f) => f.id === tab)?.element

	return (
		<WidgetContainer>
			<div className="flex flex-col h-full">
				<DateProvider>
					{ElementData && (
						<Suspense
							fallback={
								<div className="flex items-center justify-center h-full text-sm text-gray-400">
									در حال بارگذاری...
								</div>
							}
						>
							<ElementData />
						</Suspense>
					)}
				</DateProvider>

				<div className="flex-none mt-1">
					<TabNavigation
						tabMode="advanced"
						activeTab={tab}
						onTabClick={onChangeTab}
						tabs={tabs}
						size="small"
						className="w-full"
					/>
				</div>
			</div>
		</WidgetContainer>
	)
}
