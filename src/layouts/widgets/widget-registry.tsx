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
import { DateProvider } from '@/context/date.context'
import { ClockWidget } from './clock/clock.widget'
import { PetWidget } from './pet/pet.widget'
import { TransparentClockWidget } from './transparent-clock/transparent-clock.widget'
import { MoodTrackerWidget } from './mood-tracker/mood-tracker.widget'
import { TodosLayout } from './todos/todos'
import { NotesLayout } from './notes/notes.layout'
import { WidgetContainer } from './widget-container'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { type WidgetDefinition, type WidgetItem, WidgetKeys } from './layout-engine/types'
import { SimplifyWigipad } from '@/layouts/simplify/wigipad-simplify'
import { SimpleTools } from '@/layouts/simplify/tools-simplify'

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
		node: (_instanceId, size) => <SearchLayout size={size} />,
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
			{ w: 2, h: 4 },
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
		node: (_instanceId, size) => <WidgetifyLayout size={size} />,
	},
	[WidgetKeys.pet]: {
		id: WidgetKeys.pet,
		label: 'پت (حیوان خانگی)',
		emoji: '🐾',
		category: 'lifestyle',
		allowedSizes: [{ w: 2, h: 1 }],
		defaultSize: { w: 2, h: 1 },
		settingsTab: WidgetTabKeys.Pet,
		canDuplicate: true,
		node: (_instanceId) => <PetWidget />,
	},
	[WidgetKeys.wigiPad]: {
		id: WidgetKeys.wigiPad,
		label: 'ویجی‌پد',
		emoji: '⏰',
		category: 'time',
		allowedSizes: [
			{ w: 2, h: 3 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.wigiPad,
		canDuplicate: false,
		variants: [
			{
				id: 'standard',
				label: 'ویجی‌پد پیشرفته',
				size: { w: 2, h: 3 },
				meta: { variant: 'standard' },
			},
			{
				id: 'simplify',
				label: 'ویجی‌پد ساده',
				size: { w: 2, h: 3 },
				meta: { variant: 'simplify' },
			},
		],
		node: (_instanceId, _size, meta) => {
			if (meta?.variant === 'simplify') {
				return <SimplifyWigipad />
			}
			return <WigiPadWidget />
		},
	},
	[WidgetKeys.clock]: {
		id: WidgetKeys.clock,
		label: 'ساعت',
		emoji: '🕒',
		category: 'time',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 1, h: 1 },
		],
		defaultSize: { w: 2, h: 1 },
		variants: [
			{
				id: 'digital',
				label: 'ساعت دیجیتال',
				size: { w: 2, h: 1 },
				meta: { variant: 'digital' },
			},
			{
				id: 'flip',
				label: 'ساعت فیلیپ (ورقه‌ای)',
				size: { w: 2, h: 1 },
				isVipOnly: true,
				meta: { variant: 'flip' },
			},
			{
				id: 'digital-vertical',
				label: 'ساعت دیجیتال عمودی',
				size: { w: 1, h: 1 },
				meta: { variant: 'digital-vertical' },
			},
			{
				id: 'analog',
				label: 'ساعت آنالوگ',
				size: { w: 1, h: 1 },
				isVipOnly: true,
				meta: { variant: 'analog' },
			},
		],
		canDuplicate: false,
		node: (_instanceId, size, meta) => <ClockWidget size={size} meta={meta} />,
	},
	[WidgetKeys.calendar]: {
		id: WidgetKeys.calendar,
		label: 'تقویم',
		emoji: '📅',
		category: 'time',
		order: 0,
		canToggle: true,
		popular: true,
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: true,
		node: (_instanceId, size) => (
			<DateProvider>
				<CalendarLayout size={size} />
			</DateProvider>
		),
	},
	[WidgetKeys.weather]: {
		id: WidgetKeys.weather,
		label: 'آب و هوا',
		emoji: '🌤️',
		category: 'info',
		order: 3,
		canToggle: true,
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
		node: (_instanceId, size) => <WeatherLayout size={size} />,
	},
	[WidgetKeys.comboWidget]: {
		id: WidgetKeys.comboWidget,
		label: 'ویجت ترکیبی (ارز و اخبار)',
		emoji: '🔗',
		category: 'info',
		order: 4,
		canToggle: true,
		popular: true,
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,
		node: (_instanceId, size) => (
			<CurrencyProvider>
				<ComboWidget />
			</CurrencyProvider>
		),
	},
	[WidgetKeys.yadKar]: {
		id: WidgetKeys.yadKar,
		label: 'یادکار (وظایف/یادداشت/عادت‌ها)',
		emoji: '📒',
		category: 'productivity',
		order: 1,
		canToggle: true,
		isNew: false,
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: true,
		node: (_instanceId, size) => <YadkarWidget size={size} />,
	},
	[WidgetKeys.tools]: {
		id: WidgetKeys.tools,
		label: 'ابزارها',
		emoji: '🧰',
		category: 'productivity',
		order: 2,
		canToggle: true,
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
			{ w: 2, h: 4 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,
		variants: [
			{
				id: 'standard',
				label: 'ابزارهای پیشرفته',
				size: { w: 2, h: 3 },
				meta: { variant: 'standard' },
			},
			{
				id: 'simplify',
				label: 'همچیز‌ یکجا',
				size: { w: 2, h: 3 },
				meta: { variant: 'simplify' },
			},
		],
		node: (_instanceId, size, meta) => {
			if (meta?.variant === 'simplify') {
				return (
					<CurrencyProvider>
						<SimpleTools />
					</CurrencyProvider>
				)
			}
			return <ToolsLayout size={size} />
		},
	},
	[WidgetKeys.arzLive]: {
		id: WidgetKeys.arzLive,
		label: 'ویجی ارز',
		emoji: '💰',
		category: 'info',
		order: 5,
		canToggle: true,
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 2 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.wigiArz,
		variants: [
			{
				id: 'list',
				label: 'لیست قیمت ارزها',
				size: { w: 2, h: 3 },
				meta: { variant: 'list' },
			},
			{
				id: 'stacked',
				label: 'خلاصه ۳ ارز',
				size: { w: 2, h: 2 },
				meta: { variant: 'stacked' },
			},
			{
				id: 'compact',
				label: 'تک ارز',
				size: { w: 1, h: 1 },
				meta: { currencyCode: 'USD', variant: 'compact' },
				isVipOnly: true,
			},
		],
		canDuplicate: true,
		node: (instanceId, size, meta) => (
			<CurrencyProvider>
				<WigiArzLayout
					inComboWidget={false}
					size={size}
					meta={meta}
					instanceId={instanceId}
				/>
			</CurrencyProvider>
		),
	},
	[WidgetKeys.news]: {
		id: WidgetKeys.news,
		label: 'اخبار',
		emoji: '📰',
		category: 'info',
		order: 6,
		canToggle: true,
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.news_settings,
		canDuplicate: false,
		node: (_instanceId, size) => <NewsLayout inComboWidget={false} size={size} />,
	},
	[WidgetKeys.network]: {
		id: WidgetKeys.network,
		label: 'شبکه',
		emoji: '🌐',
		category: 'info',
		order: 7,
		canToggle: true,
		isNew: false,
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,
		node: (_instanceId, size) => (
			<NetworkLayout inComboWidget={false} enableBackground={true} size={size} />
		),
	},
	[WidgetKeys.HabitTracker]: {
		id: WidgetKeys.HabitTracker,
		label: 'عادات',
		emoji: '🎯',
		category: 'productivity',
		order: 8,
		canToggle: true,
		isNew: true,
		isBeta: false,
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: true,
		node: (_instanceId, size) => <HabitsLayout size={size} />,
	},
	[WidgetKeys.todos]: {
		id: WidgetKeys.todos,
		label: 'تسک‌ها',
		emoji: '✅',
		category: 'productivity',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
			{ w: 4, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: true,
		node: (_instanceId, size) => (
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
		allowedSizes: [
			{ w: 2, h: 3 },
			{ w: 2, h: 2 },
		],
		defaultSize: { w: 2, h: 3 },
		variants: [
			{
				id: 'list',
				label: 'لیست یادداشت‌ها',
				size: { w: 2, h: 3 },
			},
			{
				id: 'sticky',
				label: 'استیک نوت',
				size: { w: 2, h: 2 },
				meta: { variant: 'sticky' },
			},
		],
		canDuplicate: true,
		node: (instanceId, size, meta) => {
			const isSticky = meta?.variant === 'sticky' || (size.w === 2 && size.h === 2)

			return (
				<WidgetContainer padding={!isSticky} background={!isSticky}>
					<NotesLayout size={size} meta={meta} instanceId={instanceId} />
				</WidgetContainer>
			)
		},
	},
	[WidgetKeys.transparentClock]: {
		id: WidgetKeys.transparentClock,
		label: 'ساعت یخی',
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
		isVipOnly: true,
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
		],
		defaultSize: { w: 2, h: 1 },
		canDuplicate: false,
		node: (_instanceId, size) => <MoodTrackerWidget size={size} />,
	},
}

export const widgetItems: WidgetItem[] = Object.values(WIDGET_DEFINITIONS)
	.filter(
		(def): def is WidgetDefinition & { order: number } =>
			typeof def.order === 'number'
	)
	.sort((a, b) => a.order - b.order)
	.map((def) => ({
		...def,
		order: def.order,
		node: def.node(def.id, def.defaultSize),
	}))
