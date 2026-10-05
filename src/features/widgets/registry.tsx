import { BookmarkProvider } from '@/features/widgets/bookmark/bookmark.context'
import { BookmarksList } from '@/features/widgets/bookmark/bookmark.widget'
import { SearchLayout } from '@/features/widgets/search/search.widget'
import CalendarLayout from '@/features/widgets/calendar/calendar.widget'
import { ComboWidget } from '@/features/widgets/combo-widget/combo-widget.widget'
import { NetworkLayout } from '@/features/widgets/network/network.widget'
import { NewsLayout } from '@/features/widgets/news/news.widget'
import { ToolsLayout } from '@/features/widgets/tools/tools.widget'
import { WeatherLayout } from '@/features/widgets/weather/weather.widget'
import { WigiArzLayout } from '@/features/widgets/wigi-arz/wigi-arz.widget'
import { YadkarWidget } from '@/features/widgets/yadkar/yadkar.widget'
import { HabitsLayout } from '@/features/widgets/habit/habit.widget'
import { CurrencyProvider } from '@/features/widgets/currency.context'
import { DateProvider } from '@/features/widgets/date.context'
import { ClockWidget } from './clock/clock.widget'
import { PetWidget } from './pet/pet.widget'
import { TransparentClockWidget } from './transparent-clock/transparent-clock.widget'
import { MoodTrackerWidget } from './mood-tracker/mood-tracker.widget'
import { PhotoWidget } from './photo/photo.widget'
import { DotCalendarWidget } from './dot-calendar/dot-calendar.widget'
import { GoogleCalendarWidget } from './google-calendar/google-calendar.widget'
import { TodosLayout } from './todos/todos.widget'
import { NotesLayout, resolveNotesVariant } from './notes/notes.widget'
import { WidgetContainer } from './components/widget-container'
import { WidgetTabKeys } from '@/features/widgets/types'
import { type WidgetDefinition, WidgetKeys } from './utils/layout-engine/types'

export const WIDGET_DEFINITIONS: Record<WidgetKeys, WidgetDefinition> = {
	[WidgetKeys.search]: {
		id: WidgetKeys.search,
		label: 'جستجو',
		emoji: '🔍',
		icon: 'search',
		category: 'productivity',
		allowedSizes: [
			{ w: 2, h: 1, isVipOnly: true },
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
		icon: 'outlineBookmark',
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
	[WidgetKeys.pet]: {
		id: WidgetKeys.pet,
		label: 'پت (حیوان خانگی)',
		emoji: '🐾',
		icon: 'paw',
		category: 'lifestyle',
		allowedSizes: [{ w: 2, h: 1 }],
		defaultSize: { w: 2, h: 1 },
		settingsTab: WidgetTabKeys.Pet,
		canDuplicate: true,
		node: (instanceId, _size, meta) => (
			<PetWidget instanceId={instanceId} meta={meta} />
		),
	},
	[WidgetKeys.clock]: {
		id: WidgetKeys.clock,
		label: 'ساعت',
		emoji: '🕒',
		icon: 'clock',
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
				meta: { variant: 'flip' },
				isVipOnly: true,
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
				meta: { variant: 'analog' },
				isVipOnly: true,
			},
		],
		canDuplicate: false,
		node: (_instanceId, size, meta) => <ClockWidget size={size} meta={meta} />,
	},
	[WidgetKeys.calendar]: {
		id: WidgetKeys.calendar,
		label: 'تقویم',
		emoji: '📅',
		icon: 'calendarDays',
		category: 'time',
		order: 0,
		canToggle: true,
		popular: true,
		allowedSizes: [
			{ w: 1, h: 1, isVipOnly: false },
			{ w: 2, h: 1, isVipOnly: true },
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
	[WidgetKeys.googleCalendar]: {
		id: WidgetKeys.googleCalendar,
		label: 'تقویم گوگل',
		emoji: '📆',
		icon: 'googleG',
		category: 'productivity',
		order: 1,
		canToggle: true,
		popular: true,
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		variants: [
			{
				id: 'schedule',
				label: 'تقویم هفتگی و روزانه',
				size: { w: 2, h: 3 },
				meta: { variant: 'schedule' },
			},
			{
				id: 'timeline',
				label: 'تایم‌لاین روزانه',
				size: { w: 2, h: 3 },
				meta: { variant: 'timeline' },
			},
			{
				id: 'agenda',
				label: 'برنامه‌های پیش‌رو',
				size: { w: 2, h: 3 },
				isVipOnly: true,
				meta: { variant: 'agenda' },
			},
			{
				id: 'compact-2x1',
				label: 'نوار برنامه روزانه',
				size: { w: 2, h: 1 },
				isVipOnly: true,
				meta: { variant: 'compact-2x1' },
			},
			{
				id: 'compact-1x1',
				label: 'خلاصه سریع رویداد',
				size: { w: 1, h: 1 },
				isVipOnly: true,
				meta: { variant: 'compact-1x1' },
			},
		],
		canDuplicate: false,
		node: (_instanceId, size, meta) => (
			<DateProvider>
				<GoogleCalendarWidget size={size} meta={meta} />
			</DateProvider>
		),
	},
	[WidgetKeys.weather]: {
		id: WidgetKeys.weather,
		label: 'آب و هوا',
		emoji: '🌤️',
		icon: 'cloudSun',
		category: 'info',
		order: 3,
		canToggle: true,
		allowedSizes: [
			{ w: 1, h: 1, isVipOnly: true },
			{ w: 2, h: 1 },
			{ w: 2, h: 2, isVipOnly: true },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.weather_settings,
		canDuplicate: false,
		node: (_instanceId, size) => <WeatherLayout size={size} />,
	},
	[WidgetKeys.comboWidget]: {
		id: WidgetKeys.comboWidget,
		label: 'ویجت ترکیبی (ارز و اخبار)',
		emoji: '🔗',
		icon: 'link',
		category: 'info',
		order: 4,
		canToggle: true,
		popular: true,
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.combo_settings,
		canDuplicate: false,
		node: () => (
			<CurrencyProvider>
				<ComboWidget />
			</CurrencyProvider>
		),
	},
	[WidgetKeys.yadKar]: {
		id: WidgetKeys.yadKar,
		label: 'یادکار (وظایف/یادداشت/عادت‌ها)',
		emoji: '📒',
		icon: 'notebook',
		category: 'productivity',
		order: 1,
		canToggle: true,
		allowedSizes: [
			{ w: 2, h: 3 },
			{ w: 4, h: 3, isVipOnly: true },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,
		node: (_instanceId, size) => <YadkarWidget size={size} />,
	},
	[WidgetKeys.tools]: {
		id: WidgetKeys.tools,
		label: 'ابزارها',
		emoji: '🧰',
		icon: 'briefcase',
		category: 'productivity',
		order: 2,
		canToggle: true,
		allowedSizes: [
			{ w: 2, h: 1, isVipOnly: true },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,

		node: (_instanceId, size) => {
			return <ToolsLayout size={size} />
		},
	},
	[WidgetKeys.arzLive]: {
		id: WidgetKeys.arzLive,
		label: 'ویجی ارز',
		emoji: '💰',
		icon: 'coin',
		category: 'info',
		order: 5,
		canToggle: true,
		allowedSizes: [
			{ w: 1, h: 1, isVipOnly: true },
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
		icon: 'outlineNewspaper',
		category: 'info',
		order: 6,
		canToggle: true,
		allowedSizes: [{ w: 2, h: 3 }],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.news_settings,
		canDuplicate: false,
		node: () => <NewsLayout inComboWidget={false} />,
	},
	[WidgetKeys.network]: {
		id: WidgetKeys.network,
		label: 'شبکه',
		emoji: '🌐',
		icon: 'wifi',
		category: 'info',
		order: 7,
		canToggle: true,
		allowedSizes: [
			{ w: 1, h: 1, isVipOnly: true },
			{ w: 2, h: 1, isVipOnly: true },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,
		node: (_instanceId, size) => <NetworkLayout size={size} />,
	},
	[WidgetKeys.HabitTracker]: {
		id: WidgetKeys.HabitTracker,
		label: 'عادت‌ها',
		emoji: '🎯',
		icon: 'target',
		category: 'productivity',
		order: 8,
		canToggle: true,
		isBeta: false,
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
			{ w: 4, h: 3, isVipOnly: true },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: false,
		node: (_instanceId, size) => <HabitsLayout size={size} />,
	},
	[WidgetKeys.todos]: {
		id: WidgetKeys.todos,
		label: 'تسک‌ها',
		emoji: '✅',
		icon: 'taskList',
		category: 'productivity',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 2, h: 3 },
			{ w: 4, h: 3, isVipOnly: true },
		],
		defaultSize: { w: 2, h: 3 },
		canDuplicate: true,
		node: (_instanceId, size) => (
			<WidgetContainer
				contentClassName={size.h === 1 ? 'px-3 py-2.5 gap-1.5' : 'p-3 gap-2'}
			>
				<TodosLayout size={size} />
			</WidgetContainer>
		),
	},
	[WidgetKeys.notes]: {
		id: WidgetKeys.notes,
		label: 'یادداشت',
		emoji: '📝',
		icon: 'edit',
		category: 'productivity',
		allowedSizes: [
			{ w: 2, h: 3 },
			{ w: 2, h: 2, isVipOnly: true },
			{ w: 4, h: 3, isVipOnly: true },
		],
		defaultSize: { w: 2, h: 3 },
		variants: [
			{
				id: 'list',
				label: 'لیست یادداشت‌ها',
				size: { w: 2, h: 3 },
				meta: { variant: 'list' },
			},
			{
				id: 'sticky',
				label: 'استیک نوت',
				size: { w: 2, h: 2 },
				isVipOnly: true,
				meta: { variant: 'sticky' },
			},
			{
				id: 'board',
				label: 'دفتر یادداشت',
				size: { w: 4, h: 3 },
				isVipOnly: true,
				meta: { variant: 'board' },
			},
		],
		canDuplicate: true,
		node: (instanceId, size, meta) => {
			const isSticky = resolveNotesVariant(size, meta) === 'sticky'

			return (
				<WidgetContainer
					padding={!isSticky}
					background={!isSticky}
					contentClassName={isSticky ? undefined : 'p-3 gap-2'}
				>
					<NotesLayout size={size} meta={meta} instanceId={instanceId} />
				</WidgetContainer>
			)
		},
	},
	[WidgetKeys.transparentClock]: {
		id: WidgetKeys.transparentClock,
		label: 'ساعت شفاف',
		emoji: '🕒',
		icon: 'clock',
		category: 'time',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 2, h: 2 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 2, h: 2 },
		variants: [
			{
				id: 'persian',
				label: 'ساعت شفاف فارسی',
				size: { w: 2, h: 2 },
				meta: { variant: 'persian' },
			},
			{
				id: 'english',
				label: 'ساعت شفاف انگلیسی',
				size: { w: 2, h: 2 },
				meta: { variant: 'english' },
			},
		],
		canDuplicate: false,
		isVipOnly: false,
		canResize: true,
		node: (_instanceId, _size, meta) => <TransparentClockWidget meta={meta} />,
	},
	[WidgetKeys.moodTracker]: {
		id: WidgetKeys.moodTracker,
		label: 'حال روزانه (Mood)',
		emoji: '🥰',
		icon: 'mood',
		category: 'lifestyle',
		isVipOnly: false,
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
		],
		defaultSize: { w: 2, h: 1 },
		canDuplicate: false,
		node: (_instanceId, size) => <MoodTrackerWidget size={size} />,
	},
	[WidgetKeys.photo]: {
		id: WidgetKeys.photo,
		label: 'قاب عکس',
		emoji: '🖼️',
		icon: 'image',
		category: 'lifestyle',
		isVipOnly: false,
		allowedSizes: [
			{ w: 1, h: 1, isVipOnly: true },
			{ w: 2, h: 1 },
			{ w: 2, h: 2 },
			{ w: 2, h: 4 },
		],
		defaultSize: { w: 2, h: 2 },
		canDuplicate: true,
		node: (instanceId, size, meta) => (
			<PhotoWidget size={size} meta={meta} instanceId={instanceId} />
		),
	},
	[WidgetKeys.dotCalendar]: {
		id: WidgetKeys.dotCalendar,
		label: 'تقویم نقطه‌ای',
		emoji: '⏳',
		icon: 'calendarRange',
		category: 'time',
		allowedSizes: [{ w: 2, h: 2 }],
		defaultSize: { w: 2, h: 2 },
		variants: [
			{
				id: 'year',
				label: 'روزهای سال',
				size: { w: 2, h: 2 },
				meta: { variant: 'year' },
			},
			{
				id: 'goal',
				label: 'روزشمار هدف',
				size: { w: 2, h: 2 },
				meta: { variant: 'goal' },
				isVipOnly: true,
			},
		],
		canResize: true,
		settingsTab: WidgetTabKeys.dot_calendar_settings,
		canDuplicate: true,
		node: (instanceId, size, meta) => (
			<DotCalendarWidget instanceId={instanceId} size={size} meta={meta} />
		),
	},
}
