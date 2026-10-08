import { WidgetKeys } from '../utils/layout-engine/types'
import type { PresetLayout } from './types'

export const PRESET_LAYOUTS: PresetLayout[] = [
	{
		id: 'default',
		titleKey: 'widgets.presets.default.title',

		descriptionKey: 'widgets.presets.default.description',

		isVip: false,
		isFeatured: true,
		category: 'daily',
		widgets: [
			{
				id: WidgetKeys.clock,
				instanceId: 'clock-default',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
				meta: { variant: 'digital' },
			},
			{
				id: WidgetKeys.moodTracker,
				instanceId: 'moodtracker-default',
				position: { col: 0, row: 1 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.weather,
				instanceId: 'weather-default',
				position: { col: 0, row: 2 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.search,
				instanceId: 'search-default',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'bookmarks-default',
				position: { col: 2, row: 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.photo,
				instanceId: 'photo-default',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 2 },
			},
			{
				id: WidgetKeys.pet,
				instanceId: 'pet-default',
				position: { col: 6, row: 2 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.comboWidget,
				instanceId: 'combo-widget-default',
				position: { col: 0, row: 3 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.yadKar,
				instanceId: 'yadkar-default',
				position: { col: 2, row: 3 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.tools,
				instanceId: 'tools-default',
				position: { col: 4, row: 3 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.calendar,
				instanceId: 'calendar-default',
				position: { col: 6, row: 3 },
				size: { w: 2, h: 3 },
			},
		],
	},
	{
		id: 'simple-appearance',
		titleKey: 'widgets.presets.simple-appearance.title',

		descriptionKey: 'widgets.presets.simple-appearance.description',

		isVip: false,
		isFeatured: true,
		category: 'daily',
		verticalAlign: 'split-bottom',
		widgets: [
			{
				id: WidgetKeys.search,
				instanceId: 'search-simple',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.clock,
				instanceId: 'clock-simple',
				position: { col: 0, row: 1 },
				size: { w: 2, h: 1 },
				meta: { variant: 'digital' },
			},
			{
				id: WidgetKeys.moodTracker,
				instanceId: 'moodtracker-simple',
				position: { col: 0, row: 2 },
				size: { w: 1, h: 1 },
			},
			{
				id: WidgetKeys.calendar,
				instanceId: 'calendar-simple',
				position: { col: 1, row: 2 },
				size: { w: 1, h: 1 },
			},
			{
				id: WidgetKeys.HabitTracker,
				instanceId: 'habittracker-simple',
				position: { col: 0, row: 3 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'bookmarks-simple',
				position: { col: 2, row: 2 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.yadKar,
				instanceId: 'yadkar-simple',
				position: { col: 6, row: 1 },
				size: { w: 2, h: 3 },
			},
		],
	},
	{
		id: 'deep-work-flow',
		titleKey: 'widgets.presets.deep-work-flow.title',

		descriptionKey: 'widgets.presets.deep-work-flow.description',

		isVip: false,
		isFeatured: true,
		category: 'productivity',
		widgets: [
			{
				id: WidgetKeys.clock,
				instanceId: 'work-clock',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
				meta: { variant: 'digital' },
			},
			{
				id: WidgetKeys.search,
				instanceId: 'work-search',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.HabitTracker,
				instanceId: 'work-habit',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.todos,
				instanceId: 'work-todos',
				position: { col: 0, row: 1 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.notes,
				instanceId: 'work-notes',
				position: { col: 2, row: 1 },
				size: { w: 2, h: 3 },
				meta: { variant: 'list' },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'work-bookmarks',
				position: { col: 4, row: 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.calendar,
				instanceId: 'work-calendar',
				position: { col: 4, row: 3 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.tools,
				instanceId: 'work-tools',
				position: { col: 6, row: 3 },
				size: { w: 2, h: 3 },
			},
		],
	},
	{
		id: 'student-study-hub',
		titleKey: 'widgets.presets.student-study-hub.title',

		descriptionKey: 'widgets.presets.student-study-hub.description',

		isVip: false,
		isFeatured: false,
		category: 'productivity',
		widgets: [
			{
				id: WidgetKeys.clock,
				instanceId: 'student-clock',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
				meta: { variant: 'digital' },
			},
			{
				id: WidgetKeys.search,
				instanceId: 'student-search',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.weather,
				instanceId: 'student-weather',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.googleCalendar,
				instanceId: 'student-calendar',
				position: { col: 0, row: 1 },
				size: { w: 2, h: 3 },
				meta: { variant: 'schedule' },
			},
			{
				id: WidgetKeys.todos,
				instanceId: 'student-todos',
				position: { col: 2, row: 1 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'student-bookmarks',
				position: { col: 4, row: 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.photo,
				instanceId: 'student-photo',
				position: { col: 4, row: 3 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.tools,
				instanceId: 'student-tools',
				position: { col: 6, row: 3 },
				size: { w: 2, h: 3 },
			},
		],
	},
	{
		id: 'news-culture-magazine',
		titleKey: 'widgets.presets.news-culture-magazine.title',

		descriptionKey: 'widgets.presets.news-culture-magazine.description',

		isVip: false,
		isFeatured: false,
		category: 'daily',
		widgets: [
			{
				id: WidgetKeys.clock,
				instanceId: 'news-mag-clock',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
				meta: { variant: 'digital' },
			},
			{
				id: WidgetKeys.search,
				instanceId: 'news-mag-search',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.weather,
				instanceId: 'news-mag-weather',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.news,
				instanceId: 'news-mag-feed',
				position: { col: 0, row: 1 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.arzLive,
				instanceId: 'news-mag-arz',
				position: { col: 2, row: 1 },
				size: { w: 2, h: 3 },
				meta: { variant: 'list' },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'news-mag-bookmarks',
				position: { col: 4, row: 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.calendar,
				instanceId: 'news-mag-calendar',
				position: { col: 4, row: 3 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.moodTracker,
				instanceId: 'news-mag-mood',
				position: { col: 6, row: 3 },
				size: { w: 2, h: 1 },
			},
		],
	},
	{
		id: 'cozy-lifestyle',
		titleKey: 'widgets.presets.cozy-lifestyle.title',

		descriptionKey: 'widgets.presets.cozy-lifestyle.description',

		isVip: false,
		isFeatured: false,
		category: 'lifestyle',
		widgets: [
			{
				id: WidgetKeys.clock,
				instanceId: 'cozy-clock',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
				meta: { variant: 'digital' },
			},
			{
				id: WidgetKeys.search,
				instanceId: 'cozy-search',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.weather,
				instanceId: 'cozy-weather',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.photo,
				instanceId: 'cozy-photo-large',
				position: { col: 0, row: 1 },
				size: { w: 2, h: 2 },
			},
			{
				id: WidgetKeys.pet,
				instanceId: 'cozy-pet',
				position: { col: 0, row: 3 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'cozy-bookmarks',
				position: { col: 2, row: 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.moodTracker,
				instanceId: 'cozy-mood',
				position: { col: 2, row: 3 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.HabitTracker,
				instanceId: 'cozy-habit',
				position: { col: 4, row: 3 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.calendar,
				instanceId: 'cozy-cal',
				position: { col: 6, row: 1 },
				size: { w: 2, h: 3 },
			},
		],
	},
	{
		id: 'habit-builder-compact',
		titleKey: 'widgets.presets.habit-builder-compact.title',

		descriptionKey: 'widgets.presets.habit-builder-compact.description',

		isVip: false,
		isFeatured: false,
		category: 'productivity',
		widgets: [
			{
				id: WidgetKeys.clock,
				instanceId: 'builder-clock',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
				meta: { variant: 'digital' },
			},
			{
				id: WidgetKeys.search,
				instanceId: 'builder-search',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.weather,
				instanceId: 'builder-weather',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.HabitTracker,
				instanceId: 'builder-habit',
				position: { col: 0, row: 1 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.notes,
				instanceId: 'builder-notes',
				position: { col: 2, row: 1 },
				size: { w: 2, h: 3 },
				meta: { variant: 'list' },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'builder-bookmarks',
				position: { col: 4, row: 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.moodTracker,
				instanceId: 'builder-mood',
				position: { col: 4, row: 3 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.pet,
				instanceId: 'builder-pet',
				position: { col: 6, row: 3 },
				size: { w: 2, h: 1 },
			},
		],
	},
	{
		id: 'crypto-finance-hub',
		titleKey: 'widgets.presets.crypto-finance-hub.title',

		descriptionKey: 'widgets.presets.crypto-finance-hub.description',

		isVip: true,
		isFeatured: true,
		category: 'finance',
		verticalAlign: 'split-bottom',
		widgets: [
			{
				id: WidgetKeys.search,
				instanceId: 'crypto-search',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.arzLive,
				instanceId: 'crypto-arz-live',
				position: { col: 0, row: 1 },
				size: { w: 2, h: 3 },
				meta: { variant: 'stacked' },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'crypto-bookmarks',
				position: { col: 2, row: 1 },
				size: { w: 4, h: 2 },
			},
			{
				id: WidgetKeys.clock,
				instanceId: 'crypto-clock',
				position: { col: 2, row: 3 },
				size: { w: 2, h: 1 },
				meta: { variant: 'flip' },
			},
			{
				id: WidgetKeys.network,
				instanceId: 'crypto-network',
				position: { col: 4, row: 3 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.news,
				instanceId: 'crypto-news',
				position: { col: 6, row: 1 },
				size: { w: 2, h: 3 },
			},
		],
	},
	{
		id: 'developer-cockpit',
		titleKey: 'widgets.presets.developer-cockpit.title',

		descriptionKey: 'widgets.presets.developer-cockpit.description',

		isVip: true,
		isFeatured: false,
		category: 'productivity',
		widgets: [
			{
				id: WidgetKeys.search,
				instanceId: 'dev-search',
				position: { col: 0, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.clock,
				instanceId: 'dev-clock',
				position: { col: 4, row: 0 },
				size: { w: 2, h: 1 },
				meta: { variant: 'flip' },
			},
			{
				id: WidgetKeys.network,
				instanceId: 'dev-net',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.todos,
				instanceId: 'dev-todos',
				position: { col: 0, row: 1 },
				size: { w: 4, h: 3 },
			},
			{
				id: WidgetKeys.bookmarks,
				instanceId: 'dev-bookmarks',
				position: { col: 4, row: 1 },
				size: { w: 2, h: 2 },
			},
			{
				id: WidgetKeys.notes,
				instanceId: 'dev-notes',
				position: { col: 6, row: 1 },
				size: { w: 2, h: 2 },
				meta: { variant: 'sticky' },
			},
			{
				id: WidgetKeys.tools,
				instanceId: 'dev-tools',
				position: { col: 4, row: 3 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.weather,
				instanceId: 'dev-weather',
				position: { col: 6, row: 3 },
				size: { w: 2, h: 1 },
			},
		],
	},
	{
		id: 'habit-mindfulness',
		titleKey: 'widgets.presets.habit-mindfulness.title',

		descriptionKey: 'widgets.presets.habit-mindfulness.description',

		isVip: true,
		isFeatured: false,
		category: 'lifestyle',
		widgets: [
			{
				id: WidgetKeys.clock,
				instanceId: 'mind-clock',
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
				meta: { variant: 'analog' },
			},
			{
				id: WidgetKeys.search,
				instanceId: 'mind-search',
				position: { col: 2, row: 0 },
				size: { w: 4, h: 1 },
			},
			{
				id: WidgetKeys.weather,
				instanceId: 'mind-weather',
				position: { col: 6, row: 0 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.HabitTracker,
				instanceId: 'mind-habit',
				position: { col: 0, row: 1 },
				size: { w: 2, h: 3 },
			},
			{
				id: WidgetKeys.notes,
				instanceId: 'mind-notes',
				position: { col: 2, row: 1 },
				size: { w: 4, h: 2 },
				meta: { variant: 'sticky' },
			},
			{
				id: WidgetKeys.moodTracker,
				instanceId: 'mind-mood',
				position: { col: 2, row: 3 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.pet,
				instanceId: 'mind-pet',
				position: { col: 4, row: 3 },
				size: { w: 2, h: 1 },
			},
			{
				id: WidgetKeys.calendar,
				instanceId: 'mind-cal',
				position: { col: 6, row: 1 },
				size: { w: 2, h: 3 },
			},
		],
	},
]
