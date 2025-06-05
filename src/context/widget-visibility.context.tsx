import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import CalendarLayout from '@/layouts/widgets/calendar/calendar'
import { ComboWidget } from '@/layouts/widgets/comboWidget/combo-widget.layout'
import { NewsLayout } from '@/layouts/widgets/news/news.layout'
import { NotesLayout } from '@/layouts/widgets/notes/notes.layout'
import { TodosLayout } from '@/layouts/widgets/todos/todos'
import { ToolsLayout } from '@/layouts/widgets/tools/tools.layout'
import { WeatherLayout } from '@/layouts/widgets/weather/weather.layout'
import { WigiArzLayout } from '@/layouts/widgets/wigiArz/wigi_arz.layout'
import { WigiPadWidget } from '@/layouts/widgets/wigiPad/wigiPad.layout'
import { YouTubeLayout } from '@/layouts/widgets/youtube/youtube.layout'
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { CurrencyProvider } from './currency.context'

export enum WidgetKeys {
	comboWidget = 'comboWidget',
	arzLive = 'arzLive',
	news = 'news',
	calendar = 'calendar',
	weather = 'weather',
	todos = 'todos',
	tools = 'tools',
	notes = 'notes',
	youtube = 'youtube',
	wigiPad = 'wigiPad',
}
export interface WidgetItem {
	id: WidgetKeys
	emoji: string
	label: string
	node: any
	order: number
}

export const widgetItems: WidgetItem[] = [
	{
		id: WidgetKeys.comboWidget,
		emoji: '🔗',
		label: 'ویجت ترکیبی (ارز و اخبار)',
		order: 0,
		node: (
			<CurrencyProvider>
				<ComboWidget />
			</CurrencyProvider>
		),
	},
	{
		id: WidgetKeys.arzLive,
		emoji: '💰',
		label: 'ویجی ارز',
		order: 1,
		node: (
			<CurrencyProvider>
				<WigiArzLayout inComboWidget={false} />
			</CurrencyProvider>
		),
	},
	{
		id: WidgetKeys.news,
		emoji: '📰',
		label: 'ویجی اخبار',
		order: 2,
		node: <NewsLayout inComboWidget={false} />,
	},
	{
		id: WidgetKeys.calendar,
		emoji: '📅',
		label: 'تقویم',
		order: 3,
		node: <CalendarLayout />,
	},
	{
		id: WidgetKeys.weather,
		emoji: '🌤️',
		label: 'آب و هوا',
		order: 4,
		node: <WeatherLayout />,
	},
	{
		id: WidgetKeys.todos,
		emoji: '✅',
		label: 'وظایف',
		order: 5,
		node: <TodosLayout />,
	},
	{
		id: WidgetKeys.tools,
		emoji: '🧰',
		label: 'ابزارها',
		order: 6,
		node: <ToolsLayout />,
	},
	{
		id: WidgetKeys.notes,
		emoji: '📝',
		label: 'یادداشت‌ها',
		order: 7,
		node: <NotesLayout />,
	},
	{
		id: WidgetKeys.youtube,
		emoji: '📺',
		label: 'آمار یوتیوب',
		order: 8,
		node: <YouTubeLayout />,
	},
	{
		id: WidgetKeys.wigiPad,
		emoji: '🏠',
		label: 'ویجی پد',
		order: 9,
		node: <WigiPadWidget />,
	},
]

interface WidgetVisibilityContextType {
	visibility: WidgetKeys[]
	toggleWidget: (widgetId: WidgetKeys) => void
	openWidgetSettings: () => void
	reorderWidgets: (sourceIndex: number, destinationIndex: number) => void
	getSortedWidgets: () => WidgetItem[]
}

const defaultVisibility: WidgetKeys[] = [
	WidgetKeys.comboWidget,
	WidgetKeys.calendar,
	WidgetKeys.tools,
	WidgetKeys.todos,
	WidgetKeys.weather,
]

const WidgetVisibilityContext = createContext<WidgetVisibilityContextType | undefined>(
	undefined,
)

const getDefaultWidgetOrders = (): Record<WidgetKeys, number> => {
	const orders: Record<WidgetKeys, number> = {} as Record<WidgetKeys, number>
	for (const item of widgetItems) {
		orders[item.id] = item.order
	}
	return orders
}

export function WidgetVisibilityProvider({ children }: { children: ReactNode }) {
	const [visibility, setVisibility] = useState<WidgetKeys[]>([])
	const [widgetOrders, setWidgetOrders] =
		useState<Record<WidgetKeys, number>>(getDefaultWidgetOrders)
	const firstRender = useRef(true)
	useEffect(() => {
		async function loadSettings() {
			const storedVisibility = await getFromStorage('activeWidgets')
			if (storedVisibility) {
				const visibilityIds = storedVisibility.map((item: any) => item.id as WidgetKeys)
				setVisibility(visibilityIds)

				const orders: Record<WidgetKeys, number> = {} as Record<WidgetKeys, number>
				for (const item of storedVisibility) {
					orders[item.id as WidgetKeys] =
						item.order ?? getDefaultWidgetOrders()[item.id as WidgetKeys]
				}
				setWidgetOrders(orders)
			} else {
				setVisibility(defaultVisibility)
				setWidgetOrders(getDefaultWidgetOrders())
			}
			firstRender.current = false
		}

		loadSettings()
	}, [])
	useEffect(() => {
		if (!firstRender.current) {
			const activeWidgets = widgetItems
				.filter((item) => visibility.includes(item.id))
				.map((item) => ({
					...item,
					order: widgetOrders[item.id] ?? item.order,
				}))
			setToStorage('activeWidgets', activeWidgets)
		}
	}, [visibility, widgetOrders])

	const toggleWidget = (widgetId: WidgetKeys) => {
		setVisibility((prev) => {
			const newVisibility = prev.includes(widgetId)
				? prev.filter((id) => id !== widgetId)
				: [...prev, widgetId]

			return newVisibility
		})
		Analytics.featureUsed(
			'widget_visibility',
			{
				widget_id: widgetId,
				new_state: !visibility.includes(widgetId),
			},
			'toggle',
		)
	}

	const openWidgetSettings = () => {
		window.dispatchEvent(new Event('openWidgetSettings'))
	}

	const reorderWidgets = (sourceIndex: number, destinationIndex: number) => {
		const visibleWidgets = getSortedWidgets()

		if (sourceIndex === destinationIndex) return

		setWidgetOrders((prev) => {
			const newOrders = { ...prev }

			const reorderedWidgets = [...visibleWidgets]
			const [draggedWidget] = reorderedWidgets.splice(sourceIndex, 1)
			reorderedWidgets.splice(destinationIndex, 0, draggedWidget)

			reorderedWidgets.forEach((widget, index) => {
				newOrders[widget.id] = index
			})

			return newOrders
		})
	}

	const getSortedWidgets = (): WidgetItem[] => {
		return widgetItems
			.filter((item) => visibility.includes(item.id))
			.map((item) => ({
				...item,
				order: widgetOrders[item.id] ?? item.order,
			}))
			.sort((a, b) => a.order - b.order)
	}
	return (
		<WidgetVisibilityContext.Provider
			value={{
				visibility,
				toggleWidget,
				openWidgetSettings,
				reorderWidgets,
				getSortedWidgets,
			}}
		>
			{children}
		</WidgetVisibilityContext.Provider>
	)
}

export const useWidgetVisibility = () => {
	const context = useContext(WidgetVisibilityContext)
	if (context === undefined) {
		throw new Error('useWidgetVisibility must be used within a WidgetVisibilityProvider')
	}
	return context
}
