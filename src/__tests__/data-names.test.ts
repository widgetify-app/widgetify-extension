import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'

const STORAGE_KEYS = [
	'activeWidgets',
	'analyticsSession',
	'appearance',
	'auth_token',
	'bookmarks',
	'browserTitle',
	'clock',
	'comboTabs',
	'configData',
	'currencies',
	'currentWeather',
	'customWallpaper',
	'deletedBookmarkIds',
	'forecastWeather',
	'gaClientId',
	'generalSettings',
	'hasSeenFooterDisableHint',
	'hasSeenTour',
	'hasShownPwaModal',
	'lastVersion',
	'navbarVisible',
	'notes_data',
	'notifications',
	'pendingOrders',
	'pets',
	'pomodoro_session',
	'pomodoro_settings',
	'profile',
	'recent_searches',
	'recommended_sites',
	'refresh_token',
	'rssOptions',
	'search_trends',
	'seenWidgetSettings_1',
	'selected_engine',
	'showNewBadgeForReOrderWidgets',
	'showWelcomeModal',
	'storedWidgets',
	'theme',
	'todoFilter',
	'todoSort',
	'toolsTab',
	'wallpaper',
	'weatherSettings',
	'widgetLayoutMigrationVersion',
	'widget_tab',
	'yadkar_tab',
]

const ANALYTICS_EVENTS = [
	'IconClicked',
	'Installed',
	'Startup',
	'Updated',
	'add_bookmark',
	'add_notes',
	'auth_method_changed_to_google',
	'auth_otp_requested',
	'auth_otp_verified',
	'avatar_updated',
	'avatar_updated_from_gallery',
	'blurModeConfirm',
	'bookmark_reorder',
	'browser_bookmark_back_clicked',
	'browser_bookmark_clicked',
	'browser_bookmark_folder_opened',
	'browser_bookmark_import_permission_clicked',
	'browser_bookmark_permission_clicked',
	'browser_bookmark_popover_toggled',
	'browser_title_market_opened',
	'browser_title_selected',
	'calendar_day_click',
	'calendar_mood_clicked',
	'city_selected',
	'close_add_phone_modal',
	'coin_package_purchase_failed',
	'coin_package_purchase_unauthenticated',
	'coin_package_purchased',
	'combo_tab_changed',
	'currency_compact_setting_change',
	'currency_reorder',
	'currency_selection',
	'currency_selection_blocked',
	'currency_sponsor',
	'custom_wallpaper_selected',
	'delete_bookmark',
	'delete_notes',
	'deny_notification_permission',
	'dialog_action',
	'dialog_page',
	'edit_avatar_file_selected',
	'explorer_click_category',
	'font_market_opened',
	'friends_navbar_opened',
	'gallery_avatar_opened',
	'google_calendar_event_click',
	'google_calendar_reset_day',
	'google_calendar_reset_today',
	'grant_notification_permission',
	'habit_archived',
	'habit_close_detail_model',
	'habit_edit_opened',
	'habit_form_opened',
	'habit_open_detail_model',
	'habit_quick_log',
	'habit_quick_log_wide',
	'habit_refetch',
	'import_browser_bookmarks',
	'market_item_purchase_failed',
	'market_item_purchase_unauthenticated',
	'market_item_purchased',
	'market_opened',
	'mini_app_exist',
	'mini_app_open_in_window',
	'mini_apps_page',
	'mini_apps_show_info_modal',
	'mood_share_modal_opened',
	'mood_widget_clicked',
	'note_open_required_auth_modal',
	'note_refetch',
	'note_selected',
	'note_sticky_next',
	'note_sticky_prev',
	'notification_mood_clicked',
	'notification_navbar_opened',
	'notifications_action',
	'notifications_close',
	'notifications_daily_moods',
	'notifications_page',
	'notifications_toggle_expand',
	'open_add_phone_modal',
	'open_advanced_bookmark_customization',
	'open_bookmark_in_current_tab',
	'open_bookmark_in_new_tab',
	'open_bookmark_middle_mouse',
	'open_city_selection_modal',
	'open_city_selection_modal_unauthenticated',
	'open_folder_bookmarks',
	'open_folder_bookmarks_grouped',
	'open_settings_modal',
	'open_widgets_settings_from_settings_modal',
	'pet_background_market_opened',
	'pet_market_opened',
	'pomodoro_mode_change',
	'pomodoro_pause_timer',
	'pomodoro_reset_timer',
	'pomodoro_start_timer',
	'profile_progressbar_click',
	'profile_progressbar_remove',
	'refresh_network_data',
	'rss_default_news_toggled',
	'rss_feed_toggled',
	'rss_link_opened',
	'search_input_focused',
	'search_input_focused_2x1',
	'searchbox_explorer_page_opened',
	'searchbox_image_file',
	'searchbox_image_url',
	'searchbox_open_image_search',
	'searchbox_open_voice_search',
	'sign_in',
	'theme_change',
	'theme_market_opened',
	'theme_selected',
	'todo_category_select',
	'todo_edit_close',
	'todo_edit_open',
	'todo_refetch',
	'todo_removed',
	'todo_tag_change',
	'todo_toggle_complete',
	'toggle_can_reorder_widget',
	'toggle_currency_converter_on_modal',
	'toggle_optimalMode',
	'update_notes',
	'view_request_notification_modal',
	'vip_plan_purchase_failed',
	'vip_plan_purchase_unauthenticated',
	'vip_plan_purchased',
	'vip_tab_opened',
	'voice_search_error',
	'voice_search_started',
	'voice_search_transcribed',
	'wallpaper_changed',
	'wallpaper_previewed',
	'web_app_permission_gate_clicked',
	'welcome_wizard_completed',
	'welcome_wizard_completion_failed',
	'welcome_wizard_opened',
	'welcome_wizard_step_back_clicked',
	'yadkar_change_tab',
]

const WIDGET_IDS = [
	'comboWidget',
	'arzLive',
	'news',
	'calendar',
	'weather',
	'todos',
	'tools',
	'notes',
	'network',
	'yadKar',
	'HabitTracker',
	'search',
	'bookmarks',
	'pet',
	'transparentClock',
	'moodTracker',
	'googleCalendar',
	'photo',
	'clock',
	'dotCalendar',
]

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name)
		if (statSync(path).isDirectory()) return name === '__tests__' ? [] : walk(path)
		return [path.split('\\').join('/')]
	})
}

function codeFiles(): string[] {
	return ['src', 'entrypoints', 'background']
		.flatMap(walk)
		.filter((path) => /\.tsx?$/.test(path) && !path.endsWith('.d.ts'))
}

function parse(path: string) {
	return ts.createSourceFile(
		path,
		readFileSync(path, 'utf8'),
		ts.ScriptTarget.Latest,
		true,
		path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
	)
}

function declaredStorageKeys(): Set<string> {
	const found = new Set<string>()
	const visit = (node: ts.Node) => {
		if (ts.isInterfaceDeclaration(node) && node.name.text === 'StorageKV') {
			for (const member of node.members) {
				if (!ts.isPropertySignature(member)) continue
				if (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) {
					found.add(member.name.text)
				}
			}
		}
		ts.forEachChild(node, visit)
	}
	for (const path of codeFiles()) {
		if (readFileSync(path, 'utf8').includes('interface StorageKV')) visit(parse(path))
	}
	return found
}

function sentAnalyticsEvents(): Set<string> {
	const found = new Set<string>()
	for (const path of codeFiles()) {
		const text = readFileSync(path, 'utf8')
		for (const match of text.matchAll(
			/Analytics\.event\(\s*(['"`])([^'"`$\n]+)\1/g
		)) {
			found.add(match[2])
		}
	}
	return found
}

function declaredWidgetIds(): Set<string> {
	const found = new Set<string>()
	const visit = (node: ts.Node) => {
		if (ts.isEnumDeclaration(node) && node.name.text === 'WidgetKeys') {
			for (const member of node.members) {
				if (member.initializer && ts.isStringLiteral(member.initializer)) {
					found.add(member.initializer.text)
				}
			}
		}
		ts.forEachChild(node, visit)
	}
	visit(parse('src/features/widgets/utils/layout-engine/types.ts'))
	return found
}

describe('names that are data', () => {
	it('keeps every storage key under the name users already have it saved as', () => {
		const declared = declaredStorageKeys()
		expect(STORAGE_KEYS.filter((key) => !declared.has(key))).toEqual([])
	})

	it('keeps every analytics event under the name the dashboard already has', () => {
		const sent = sentAnalyticsEvents()
		expect(ANALYTICS_EVENTS.filter((name) => !sent.has(name))).toEqual([])
	})

	it('keeps every widget id under the name saved layouts use', () => {
		const declared = declaredWidgetIds()
		expect(WIDGET_IDS.filter((id) => !declared.has(id))).toEqual([])
	})
})
