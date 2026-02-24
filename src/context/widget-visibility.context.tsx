import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import CalendarLayout from '@/layouts/widgets/calendar/calendar'
import { ComboWidget } from '@/layouts/widgets/comboWidget/combo-widget.layout'
import { NetworkLayout } from '@/layouts/widgets/network/network.layout'
import { NewsLayout } from '@/layouts/widgets/news/news.layout'
import { ToolsLayout } from '@/layouts/widgets/tools/tools.layout'
import { WeatherLayout } from '@/layouts/widgets/weather/weather.layout'
import { WigiArzLayout } from '@/layouts/widgets/wigiArz/wigi_arz.layout'
import { YouTubeLayout } from '@/layouts/widgets/youtube/youtube.layout'
import { useAuth } from './auth.context'
import { CurrencyProvider } from './currency.context'
import { showToast } from '@/common/toast'
import { YadkarWidget } from '@/layouts/widgets/yadkar/yadkar'
import { TodoProvider } from './todo.context'

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
	network = 'network',
	yadKar = 'yadKar',
}
export interface WidgetItem {
	id: WidgetKeys
	emoji: string
	label: string
	node: any
	order: number
	canToggle?: boolean
	isNew?: boolean
	disabled?: boolean
	soon?: boolean
	popular?: boolean
}

export const widgetItems: WidgetItem[] = [
	{
		id: WidgetKeys.calendar,
		emoji: '📅',
		label: 'تقویم',
		order: 0,
		node: <CalendarLayout />,
		canToggle: true,
		popular: true,
	},
	{
		id: WidgetKeys.yadKar,
		emoji: '📒',
		label: 'یادکار (وظایف و یادداشت)',
		order: 0,
		node: (
			<TodoProvider>
				<YadkarWidget />
			</TodoProvider>
		),
		canToggle: true,
		isNew: true,
	},
	{
		id: WidgetKeys.tools,
		emoji: '🧰',
		label: 'ابزارها',
		order: 1,
		node: <ToolsLayout />,
		canToggle: true,
	},

	{
		id: WidgetKeys.weather,
		emoji: '🌤️',
		label: 'آب و هوا',
		order: 3,
		node: <WeatherLayout />,
		canToggle: true,
	},
	{
		id: WidgetKeys.comboWidget,
		emoji: '🔗',
		label: 'ویجت ترکیبی (ارز و اخبار)',
		order: 4,
		node: (
			<CurrencyProvider>
				<ComboWidget />
			</CurrencyProvider>
		),
		canToggle: true,
		popular: true,
	},
	{
		id: WidgetKeys.arzLive,
		emoji: '💰',
		label: 'ویجی ارز',
		order: 5,
		node: (
			<CurrencyProvider>
				<WigiArzLayout inComboWidget={false} />
			</CurrencyProvider>
		),
		canToggle: true,
	},
	{
		id: WidgetKeys.news,
		emoji: '📰',
		label: 'ویجی نیوز',
		order: 6,
		node: <NewsLayout inComboWidget={false} />,
		canToggle: true,
	},

	{
		id: WidgetKeys.network,
		emoji: '🌐',
		label: 'شبکه',
		order: 9,
		node: <NetworkLayout inComboWidget={false} enableBackground={true} />,
		canToggle: true,
		isNew: false,
	},
	{
		id: WidgetKeys.youtube,
		emoji: '📺',
		label: 'آمار یوتیوب',
		order: 8,
		node: <YouTubeLayout />,
		canToggle: false,
		disabled: true,
		soon: true,
	},
]

interface WidgetVisibilityContextType {
	visibility: WidgetKeys[]
	toggleWidget: (widgetId: WidgetKeys) => void
	reorderWidgets: (sourceIndex: number, destinationIndex: number) => void
	getSortedWidgets: () => WidgetItem[]
}

const defaultVisibility: WidgetKeys[] = [
	WidgetKeys.calendar,
	WidgetKeys.tools,
	WidgetKeys.yadKar,
	WidgetKeys.comboWidget,
]
export const MAX_VISIBLE_WIDGETS = 5

const WidgetVisibilityContext = createContext<WidgetVisibilityContextType | undefined>(
	undefined
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
	const { isAuthenticated } = useAuth()

	const saveActiveWidgets = () => {
		const activeWidgets = widgetItems
			.filter((item) => visibility.includes(item.id))
			.map((item) => ({
				...item,
				order: widgetOrders[item.id] ?? item.order,
			}))
		setToStorage('activeWidgets', activeWidgets)
	}

	useEffect(() => {
		async function loadSettings() {
			const storedVisibility = await getFromStorage('activeWidgets')
			if (storedVisibility) {
				const visibilityIds = storedVisibility
					.filter((item) => widgetItems.some((w) => w.id === item.id))
					.map((item: any) => item.id as WidgetKeys)

				if (
					visibilityIds.includes(WidgetKeys.todos) ||
					visibilityIds.includes(WidgetKeys.notes)
				) {
					Analytics.event('yadkar_merged')

					visibilityIds.splice(visibilityIds.indexOf(WidgetKeys.todos), 1)
					visibilityIds.splice(visibilityIds.indexOf(WidgetKeys.notes), 1)

					visibilityIds.push(WidgetKeys.yadKar)
					saveActiveWidgets()
				}

				setVisibility(visibilityIds)

				const orders: Record<WidgetKeys, number> = {} as Record<
					WidgetKeys,
					number
				>
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
			saveActiveWidgets()
		}
	}, [visibility, widgetOrders])

	const toggleWidget = (widgetId: WidgetKeys) => {
		setVisibility((prev) => {
			const isCurrentlyVisible = prev.includes(widgetId)

			if (!isCurrentlyVisible) {
				if (!isAuthenticated && prev.length >= MAX_VISIBLE_WIDGETS) {
					showToast(
						`کاربران مهمان تنها می‌توانند حداکثر ${MAX_VISIBLE_WIDGETS} ویجت فعال کنند. برای فعال کردن ویجت‌های بیشتر، وارد حساب کاربری خود شوید.`,
						'error'
					)
					return prev
				}
			}

			const newVisibility = isCurrentlyVisible
				? prev.filter((id) => id !== widgetId)
				: [...prev, widgetId]

			if (isCurrentlyVisible) {
				Analytics.event(`widget_remove_${widgetId}`)
			} else {
				Analytics.event(`widget_add_${widgetId}`)
			}
			return newVisibility
		})
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
		throw new Error(
			'useWidgetVisibility must be used within a WidgetVisibilityProvider'
		)
	}
	return context
}
