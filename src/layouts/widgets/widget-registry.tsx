import { BookmarkProvider } from '@/layouts/bookmark/context/bookmark.context'
import { BookmarksList } from '@/layouts/bookmark/bookmarks'
import { SearchLayout } from '@/layouts/search/search'
import { WidgetifyLayout } from '@/layouts/widgetify-card/widgetify.layout'
import CalendarLayout from '@/layouts/widgets/calendar/calendar'
import { ComboWidget } from '@/layouts/widgets/combo-widget/combo-widget.layout'
import { NetworkLayout } from '@/layouts/widgets/network/network.layout'
import { NewsLayout } from '@/layouts/widgets/news/news.layout'
import { ToolsLayout } from '@/layouts/widgets/tools/tools.layout'
import { WeatherLayout } from '@/layouts/widgets/weather/weather.layout'
import { WigiArzLayout } from '@/layouts/widgets/wigi-arz/wigi_arz.layout'
import { WigiPadWidget } from '@/layouts/widgets/wigi-pad/wigi-pad.layout'
import { YadkarWidget } from '@/layouts/widgets/yadkar/yadkar'
import { HabitsLayout } from '@/layouts/widgets/habit/habits.layout'
import { CurrencyProvider } from '@/context/currency.context'
import { ClockWidget } from './clock/clock.widget'
import { PetWidget } from './pet/pet.widget'
import { TransparentClockWidget } from './transparent-clock/transparent-clock.widget'
import { MoodTrackerWidget } from './mood-tracker/mood-tracker.widget'
import { TodosLayout } from './todos/todos'
import { NotesLayout } from './notes/notes.layout'
import { WidgetContainer } from './widget-container'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { type WidgetDefinition, WidgetKeys } from './layout-engine/types'

export const WIDGET_DEFINITIONS: Record<WidgetKeys, WidgetDefinition> = {
	[WidgetKeys.search]: {
		id: WidgetKeys.search,
		label: 'جستجو',
		emoji: '🔍',
		category: 'productivity',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 4, h: 1 },
		],
		defaultSize: { w: 4, h: 1 },
		canDuplicate: false,
		node: (instanceId, size) => <SearchLayout size={size} />,
	},
	[WidgetKeys.bookmarks]: {
		id: WidgetKeys.bookmarks,
		label: 'بوکمارک‌ها',
		emoji: '🔖',
		category: 'productivity',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 2 },
			{ w: 4, h: 1 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 4, h: 2 },
		canDuplicate: true,
		node: (instanceId, size) => (
			<BookmarkProvider>
				<BookmarksList size={size} instanceId={instanceId} />
			</BookmarkProvider>
		),
	},
	[WidgetKeys.widgetify]: {
		id: WidgetKeys.widgetify,
		label: 'ویجتیفای',
		emoji: '✨',
		category: 'lifestyle',
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.Pet,
		canDuplicate: false,
		node: (instanceId, size) => <WidgetifyLayout size={size} />,
	},
	[WidgetKeys.pet]: {
		id: WidgetKeys.pet,
		label: 'پت (حیوان خانگی)',
		emoji: '🐾',
		category: 'lifestyle',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
		],
		defaultSize: { w: 2, h: 1 },
		settingsTab: WidgetTabKeys.Pet,
		canDuplicate: true,
		node: (instanceId, size) => <PetWidget size={size} />,
	},
	[WidgetKeys.wigiPad]: {
		id: WidgetKeys.wigiPad,
		label: 'ویجی‌پد',
		emoji: '⏰',
		category: 'time',
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.wigiPad,
		canDuplicate: false,
		node: (instanceId, size) => <WigiPadWidget size={size} />,
	},
	[WidgetKeys.clock]: {
		id: WidgetKeys.clock,
		label: 'ساعت',
		emoji: '🕒',
		category: 'time',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
		],
		defaultSize: { w: 2, h: 1 },
		settingsTab: WidgetTabKeys.wigiPad,
		canDuplicate: false,
		node: (instanceId, size) => <ClockWidget size={size} />,
	},
	[WidgetKeys.calendar]: {
		id: WidgetKeys.calendar,
		label: 'تقویم',
		emoji: '📆',
		category: 'time',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: true,
		node: (instanceId, size) => <CalendarLayout size={size} />,
	},
	[WidgetKeys.weather]: {
		id: WidgetKeys.weather,
		label: 'آب و هوا',
		emoji: '🌤️',
		category: 'info',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
			{ w: 4, h: 1 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.weather_settings,
		canDuplicate: true,
		node: (instanceId, size) => <WeatherLayout size={size} />,
	},
	[WidgetKeys.comboWidget]: {
		id: WidgetKeys.comboWidget,
		label: 'ویجت ترکیبی (ارز و اخبار)',
		emoji: '🔗',
		category: 'info',
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,
		node: (instanceId, size) => (
			<CurrencyProvider>
				<ComboWidget size={size} />
			</CurrencyProvider>
		),
	},
	[WidgetKeys.yadKar]: {
		id: WidgetKeys.yadKar,
		label: 'یادکار (وظایف/یادداشت/عادت‌ها)',
		emoji: '📒',
		category: 'productivity',
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: true,
		node: (instanceId, size) => <YadkarWidget size={size} />,
	},
	[WidgetKeys.tools]: {
		id: WidgetKeys.tools,
		label: 'ابزارها',
		emoji: '🧰',
		category: 'productivity',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,
		node: (instanceId, size) => <ToolsLayout size={size} />,
	},
	[WidgetKeys.arzLive]: {
		id: WidgetKeys.arzLive,
		label: 'ویجی ارز',
		emoji: '💰',
		category: 'info',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.wigiArz,
		canDuplicate: true,
		node: (instanceId, size) => (
			<CurrencyProvider>
				<WigiArzLayout inComboWidget={false} size={size} />
			</CurrencyProvider>
		),
	},
	[WidgetKeys.news]: {
		id: WidgetKeys.news,
		label: 'ویجی نیوز',
		emoji: '📰',
		category: 'info',
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.news_settings,
		canDuplicate: false,
		node: (instanceId, size) => <NewsLayout inComboWidget={false} size={size} />,
	},
	[WidgetKeys.network]: {
		id: WidgetKeys.network,
		label: 'شبکه',
		emoji: '🌐',
		category: 'info',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,
		node: (instanceId, size) => (
			<NetworkLayout inComboWidget={false} enableBackground={true} size={size} />
		),
	},
	[WidgetKeys.HabitTracker]: {
		id: WidgetKeys.HabitTracker,
		label: 'عادات',
		emoji: '🎯',
		category: 'productivity',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 3 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: true,
		node: (instanceId, size) => <HabitsLayout size={size} />,
	},
	[WidgetKeys.todos]: {
		id: WidgetKeys.todos,
		label: 'تسک‌ها',
		emoji: '✅',
		category: 'productivity',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: true,
		node: (instanceId, size) => (
			<WidgetContainer>
				<TodosLayout size={size} />
			</WidgetContainer>
		),
	},
	[WidgetKeys.notes]: {
		id: WidgetKeys.notes,
		label: 'یادداشت',
		emoji: '📝',
		category: 'productivity',
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,
		node: (instanceId, size) => (
			<WidgetContainer>
				<NotesLayout size={size} />
			</WidgetContainer>
		),
	},
	[WidgetKeys.transparentClock]: {
		id: WidgetKeys.transparentClock,
		label: 'ساعت و تاریخ مینیمال',
		emoji: '🕒',
		category: 'time',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 2, h: 2 },
			{ w: 4, h: 1 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 4, h: 2 },
		canDuplicate: false,
		node: (_instanceId, size) => <TransparentClockWidget size={size} />,
	},
	[WidgetKeys.moodTracker]: {
		id: WidgetKeys.moodTracker,
		label: 'حال روزانه (Mood)',
		emoji: '🥰',
		category: 'lifestyle',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 1 },
		canDuplicate: false,
		node: (_instanceId, size) => <MoodTrackerWidget size={size} />,
	},
}
