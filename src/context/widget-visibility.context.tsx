import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { ComboWidget, NewsLayout, WigiArzLayout } from '@/layouts'
import CalendarLayout from '@/layouts/widgets/calendar/calendar'
import { NotesLayout } from '@/layouts/widgets/notes/notes.layout'
import { TodosLayout } from '@/layouts/widgets/todos/todos'
import { ToolsLayout } from '@/layouts/widgets/tools/tools.layout'
import { WeatherLayout } from '@/layouts/widgets/weather/weather.layout'
import { YouTubeLayout } from '@/layouts/widgets/youtube/youtube.layout'
import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { CurrencyProvider } from './currency.context'

enum WidgetKeys {
	comboWidget = 'comboWidget',
	arzLive = 'arzLive',
	news = 'news',
	calendar = 'calendar',
	weather = 'weather',
	todos = 'todos',
	tools = 'tools',
	notes = 'notes',
	youtube = 'youtube',
}
interface WidgetItem {
	id: WidgetKeys
	emoji: string
	label: string
	node: any
}

export const widgetItems: WidgetItem[] = [
	{
		id: WidgetKeys.comboWidget,
		emoji: '🔗',
		label: 'ویجت ترکیبی (ارز و اخبار)',
		node: ComboWidget,
	},
	{
		id: WidgetKeys.arzLive,
		emoji: '💰',
		label: 'ویجی ارز',
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
		node: <NewsLayout inComboWidget={false} />,
	},
	{
		id: WidgetKeys.calendar,
		emoji: '📅',
		label: 'تقویم',
		node: <CalendarLayout />,
	},
	{
		id: WidgetKeys.weather,
		emoji: '🌤️',
		label: 'آب و هوا',
		node: <WeatherLayout />,
	},
	{
		id: WidgetKeys.todos,
		emoji: '✅',
		label: 'وظایف',
		node: <TodosLayout />,
	},
	{
		id: WidgetKeys.tools,
		emoji: '🧰',
		label: 'ابزارها',
		node: <ToolsLayout />,
	},
	{
		id: WidgetKeys.notes,
		emoji: '📝',
		label: 'یادداشت‌ها',
		node: <NotesLayout />,
	},
	{
		id: WidgetKeys.youtube,
		emoji: '📺',
		label: 'آمار یوتیوب',
		node: <YouTubeLayout />,
	},
]

interface WidgetVisibilityContextType {
	visibility: WidgetKeys[]
	toggleWidget: (widgetId: WidgetKeys) => void
	openWidgetSettings: () => void
}

const defaultVisibility: WidgetKeys[] = [
	WidgetKeys.calendar,
	WidgetKeys.weather,
	WidgetKeys.tools,
	WidgetKeys.todos,
]

const WidgetVisibilityContext = createContext<WidgetVisibilityContextType | undefined>(
	undefined,
)

export function WidgetVisibilityProvider({ children }: { children: ReactNode }) {
	const [visibility, setVisibility] = useState<WidgetKeys[]>([])
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		async function loadSettings() {
			const storedVisibility = await getFromStorage('widgetVisibility')
			if (storedVisibility) {
				setVisibility(storedVisibility)
			} else {
				setVisibility(defaultVisibility)
				setToStorage('widgetVisibility', defaultVisibility)
			}
			setIsLoaded(true)
		}

		loadSettings()
	}, [])

	useEffect(() => {
		if (isLoaded) {
			setToStorage('widgetVisibility', visibility)
		}
	}, [visibility, isLoaded])

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

	return (
		<WidgetVisibilityContext.Provider
			value={{ visibility, toggleWidget, openWidgetSettings }}
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
