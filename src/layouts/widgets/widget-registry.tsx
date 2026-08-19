import type React from 'react'
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
import { DateWidget } from './date/date.widget'
import { PetWidget } from './pet/pet.widget'
import { TodosLayout } from './todos/todos'
import { NotesLayout } from './notes/notes.layout'
import { WidgetContainer } from './widget-container'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { type WidgetDefinition, WidgetKeys, type WidgetSize } from './layout-engine/types'

export const WIDGET_DEFINITIONS: Record<WidgetKeys, WidgetDefinition> = {
	[WidgetKeys.search]: {
		id: WidgetKeys.search,
		label: 'جستجو',
		emoji: '🔍',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 4, h: 1 },
			{ w: 6, h: 1 },
			{ w: 8, h: 1 },
		],
		defaultSize: { w: 4, h: 1 },
		canDuplicate: false,
		preview: () => (
			<div className="w-full h-10 rounded-xl bg-base-300/60 border border-base-content/10 flex items-center px-3 gap-2">
				<span className="text-xs text-muted">🔍</span>
				<span className="text-xs text-muted font-light">جستجو...</span>
			</div>
		),
		node: (instanceId, size) => <SearchLayout size={size} />,
	},
	[WidgetKeys.bookmarks]: {
		id: WidgetKeys.bookmarks,
		label: 'بوکمارک‌ها',
		emoji: '🔖',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 2, h: 2 },
			{ w: 4, h: 1 },
			{ w: 4, h: 2 },
			{ w: 8, h: 1 },
			{ w: 8, h: 2 },
		],
		defaultSize: { w: 4, h: 2 },
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 grid grid-cols-5 gap-1.5 items-center">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="w-full h-7 rounded-lg bg-base-200 flex items-center justify-center text-[10px] text-muted"
					>
						🌐
					</div>
				))}
			</div>
		),
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
		allowedSizes: [
			{ w: 2, h: 2 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.Pet,
		canDuplicate: false,
		preview: () => (
			<div className="w-full h-20 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col items-center justify-center gap-1">
				<span className="text-xl">🐱</span>
				<span className="text-[11px] font-bold text-content">ویجتیفای</span>
			</div>
		),
		node: (instanceId, size) => <WidgetifyLayout size={size} />,
	},
	[WidgetKeys.pet]: {
		id: WidgetKeys.pet,
		label: 'پت (حیوان خانگی)',
		emoji: '🐾',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
		],
		defaultSize: { w: 2, h: 1 },
		settingsTab: WidgetTabKeys.Pet,
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col items-center justify-center gap-1">
				<span className="text-2xl">🐶</span>
				<span className="text-[10px] text-muted">حیوان خانگی</span>
			</div>
		),
		node: (instanceId, size) => <PetWidget size={size} />,
	},
	[WidgetKeys.wigiPad]: {
		id: WidgetKeys.wigiPad,
		label: 'ویجی‌پد',
		emoji: '⏰',
		allowedSizes: [
			{ w: 2, h: 2 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 3 },
		settingsTab: WidgetTabKeys.wigiPad,
		canDuplicate: false,
		preview: () => (
			<div className="w-full h-20 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col items-center justify-center gap-1">
				<span className="text-lg font-bold text-content">12:30</span>
				<span className="text-[10px] text-muted">سه‌شنبه، ۲۸ مرداد</span>
			</div>
		),
		node: (instanceId, size) => <WigiPadWidget size={size} />,
	},
	[WidgetKeys.clock]: {
		id: WidgetKeys.clock,
		label: 'ساعت',
		emoji: '🕒',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 4, h: 1 },
		],
		defaultSize: { w: 2, h: 1 },
		settingsTab: WidgetTabKeys.wigiPad,
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex items-center justify-center">
				<span className="text-xl font-bold text-content">12:30:45</span>
			</div>
		),
		node: (instanceId, size) => <ClockWidget size={size} />,
	},
	[WidgetKeys.date]: {
		id: WidgetKeys.date,
		label: 'تاریخ',
		emoji: '📅',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 2 },
			{ w: 4, h: 1 },
		],
		defaultSize: { w: 2, h: 2 },
		settingsTab: WidgetTabKeys.wigiPad,
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col items-center justify-center">
				<span className="text-sm font-bold text-content">۲۸ مرداد ۱۴۰۵</span>
				<span className="text-[10px] text-muted">سه‌شنبه</span>
			</div>
		),
		node: (instanceId, size) => <DateWidget size={size} />,
	},
	[WidgetKeys.calendar]: {
		id: WidgetKeys.calendar,
		label: 'تقویم',
		emoji: '📆',
		allowedSizes: [
			{ w: 2, h: 2 },
			{ w: 2, h: 3 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 2, h: 2 },
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-1.5 flex flex-col justify-between">
				<span className="text-[10px] font-bold text-content text-right">
					مرداد ۱۴۰۵
				</span>
				<div className="grid grid-cols-7 gap-0.5 text-[8px] text-center text-muted">
					{[...Array(7)].map((_, i) => (
						<span key={i}>{i + 1}</span>
					))}
				</div>
			</div>
		),
		node: (instanceId, size) => <CalendarLayout size={size} />,
	},
	[WidgetKeys.weather]: {
		id: WidgetKeys.weather,
		label: 'آب و هوا',
		emoji: '🌤️',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 2 },
			{ w: 4, h: 1 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 2, h: 2 },
		settingsTab: WidgetTabKeys.weather_settings,
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex items-center justify-between">
				<span className="text-2xl">🌤️</span>
				<span className="text-lg font-bold text-content">26°C</span>
			</div>
		),
		node: (instanceId, size) => <WeatherLayout size={size} />,
	},
	[WidgetKeys.comboWidget]: {
		id: WidgetKeys.comboWidget,
		label: 'ویجت ترکیبی (ارز و اخبار)',
		emoji: '🔗',
		allowedSizes: [
			{ w: 2, h: 2 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 2, h: 2 },
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col justify-between">
				<div className="flex gap-2 text-[10px] font-bold text-content border-b border-base-content/10 pb-1">
					<span>ارزها</span>
					<span className="text-muted">اخبار</span>
				</div>
				<div className="text-[10px] text-muted flex justify-between">
					<span>USD</span>
					<span>60,000</span>
				</div>
			</div>
		),
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
		allowedSizes: [
			{ w: 2, h: 2 },
			{ w: 2, h: 3 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 2, h: 2 },
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col justify-between">
				<div className="flex gap-2 text-[10px] font-bold text-content border-b border-base-content/10 pb-1">
					<span>تسک‌ها</span>
					<span className="text-muted">یادداشت</span>
				</div>
				<div className="text-[10px] text-muted">۳ تسک باقی‌مانده</div>
			</div>
		),
		node: (instanceId, size) => <YadkarWidget size={size} />,
	},
	[WidgetKeys.tools]: {
		id: WidgetKeys.tools,
		label: 'ابزارها',
		emoji: '🧰',
		allowedSizes: [{ w: 2, h: 2 }],
		defaultSize: { w: 2, h: 2 },
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex items-center justify-around">
				<span className="text-lg">⏱️</span>
				<span className="text-lg">🕌</span>
				<span className="text-lg">🔄</span>
			</div>
		),
		node: (instanceId, size) => <ToolsLayout size={size} />,
	},
	[WidgetKeys.arzLive]: {
		id: WidgetKeys.arzLive,
		label: 'ویجی ارز',
		emoji: '💰',
		allowedSizes: [
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 2, h: 2 },
			{ w: 2, h: 3 },
			{ w: 4, h: 1 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 2, h: 2 },
		settingsTab: WidgetTabKeys.wigiArz,
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col justify-around">
				<div className="flex justify-between text-[11px]">
					<span className="font-bold text-content">USD / IRR</span>
					<span className="text-success font-mono">60,000</span>
				</div>
				<div className="flex justify-between text-[11px]">
					<span className="font-bold text-content">EUR / IRR</span>
					<span className="text-success font-mono">65,000</span>
				</div>
			</div>
		),
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
		allowedSizes: [
			{ w: 2, h: 2 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 2, h: 2 },
		settingsTab: WidgetTabKeys.news_settings,
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col justify-center gap-1">
				<span className="text-[11px] font-bold text-content truncate">
					آخرین سرخط اخبار ایران و جهان
				</span>
				<span className="text-[9px] text-muted">۲ دقیقه پیش</span>
			</div>
		),
		node: (instanceId, size) => <NewsLayout inComboWidget={false} size={size} />,
	},
	[WidgetKeys.network]: {
		id: WidgetKeys.network,
		label: 'شبکه',
		emoji: '🌐',
		allowedSizes: [{ w: 2, h: 2 }],
		defaultSize: { w: 2, h: 2 },
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex items-center justify-between">
				<div className="flex items-center gap-1 text-[11px] text-success">
					<div className="w-2 h-2 rounded-full bg-success animate-pulse" />
					<span>متصل</span>
				</div>
				<span className="text-xs font-mono text-content">Ping: 32ms</span>
			</div>
		),
		node: (instanceId, size) => (
			<NetworkLayout inComboWidget={false} enableBackground={true} size={size} />
		),
	},
	[WidgetKeys.HabitTracker]: {
		id: WidgetKeys.HabitTracker,
		label: 'عادات',
		emoji: '🎯',
		allowedSizes: [
			{ w: 2, h: 2 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 2 },
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col justify-between">
				<span className="text-[11px] font-bold text-content">عادات روزانه</span>
				<div className="flex gap-1">
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className="w-4 h-4 rounded-md bg-primary/30 flex items-center justify-center text-[8px]"
						>
							✓
						</div>
					))}
				</div>
			</div>
		),
		node: (instanceId, size) => <HabitsLayout size={size} />,
	},
	[WidgetKeys.todos]: {
		id: WidgetKeys.todos,
		label: 'تسک‌ها',
		emoji: '✅',
		allowedSizes: [
			{ w: 2, h: 1 },
			{ w: 2, h: 2 },
			{ w: 2, h: 3 },
		],
		defaultSize: { w: 2, h: 2 },
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col justify-center gap-1">
				<div className="flex items-center gap-1 text-[10px] text-content">
					<span>☑️</span>
					<span className="truncate">مطالعه کتاب</span>
				</div>
				<div className="flex items-center gap-1 text-[10px] text-content">
					<span>⬜</span>
					<span className="truncate">ورزش صبحگاهی</span>
				</div>
			</div>
		),
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
		allowedSizes: [
			{ w: 2, h: 2 },
			{ w: 2, h: 3 },
			{ w: 4, h: 2 },
		],
		defaultSize: { w: 2, h: 2 },
		canDuplicate: true,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex flex-col justify-center gap-1">
				<span className="text-[11px] font-bold text-content truncate">
					یادداشت‌های من
				</span>
				<span className="text-[9px] text-muted truncate">
					ایده‌های طراحی جدید...
				</span>
			</div>
		),
		node: (instanceId, size) => (
			<WidgetContainer>
				<NotesLayout />
			</WidgetContainer>
		),
	},
	[WidgetKeys.youtube]: {
		id: WidgetKeys.youtube,
		label: 'یوتیوب',
		emoji: '▶️',
		allowedSizes: [{ w: 2, h: 2 }],
		defaultSize: { w: 2, h: 2 },
		canDuplicate: false,
		preview: () => (
			<div className="w-full h-16 rounded-xl bg-base-300/40 border border-base-content/10 p-2 flex items-center justify-center">
				<span className="text-xl">▶️</span>
			</div>
		),
		node: () => null,
	},
}
