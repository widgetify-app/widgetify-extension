import Analytics from '@/analytics'
import { WidgetContainer } from '../widgets/widget-container'
import { TabNavigation } from '@/components/tab-navigation'
import React, { useState, Suspense } from 'react'
import { DateProvider } from '@/context/date.context'
import { getFromStorage, setToStorage } from '@/common/storage'
import { TodosLayout } from '../widgets/todos/todos'
import { Icon } from '@/src/icons'

const Calendar = React.lazy(() =>
	import('./widgets/calendar-simplify').then((module) => ({
		default: module.SimplifyCalendar,
	}))
)

const ArzSimplify = React.lazy(() =>
	import('./widgets/arz-simplify').then((module) => ({
		default: module.ArzSimplify,
	}))
)

const Habit = React.lazy(() =>
	import('./widgets/habit-simplify').then((module) => ({
		default: module.HabitSimplify,
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
		label: 'تسک ها',
		icon: <Icon name="taskList" />,
		element: TodosLayout,
	},
	{
		id: 'habit',
		label: 'عادت ها',
		icon: <Icon name="strike" />,
		element: Habit,
	},

	{
		id: 'calendar',
		label: 'تقویم',
		icon: <Icon name="calendar" />,
		element: Calendar,
	},
	{
		id: 'currency',
		label: 'ارزها',
		icon: <Icon name="currency" />,
		element: ArzSimplify,
	},
	{
		id: 'news',
		label: 'اخبار',
		icon: <Icon name="outlineNewspaper" />,
		element: NewsSimplify,
	},
]

type TabId = string

export function SimpleTools() {
	const [tab, setTab] = useState<TabId | null>(null)

	const onChangeTab = (newTab: TabId) => {
		setTab(newTab)
		Analytics.event('yadkar_change_tab')
		setToStorage('widget_tab', newTab)
	}

	const ElementData = tabs.find((f) => f.id === tab)?.element

	useEffect(() => {
		async function load() {
			const tabFromStorage = await getFromStorage('widget_tab')
			if (!tabFromStorage) {
				setTab('calendar')
			} else {
				setTab(tabFromStorage)
			}
		}

		load()
	}, [])

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
						className="h-fit  border-none! flex-nowrap w-full"
					/>
				</div>
			</div>
		</WidgetContainer>
	)
}
