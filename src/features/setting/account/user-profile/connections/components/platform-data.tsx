import { t } from '@/common/i18n'
import type { Platform } from './platform-config'
import GoogleCalendar from '@/assets/images/google-calendar.png'

export const PLATFORM_CONFIGS: Omit<Platform, 'connected' | 'isLoading'>[] = [
	{
		id: 'google',
		name: t('setting.connections.googleCalendarName'),
		description: t('setting.connections.googleCalendarDescription'),
		bgColor: '',
		isActive: true,
		icon: (
			<img
				src={GoogleCalendar}
				alt="Google Calendar"
				className={`w-8 h-8 rounded-sm`}
			/>
		),
		features: [
			t('setting.connections.featureCalendarAccess'),
			t('setting.connections.featureSmartReminders'),
		],
		permissions: [t('setting.connections.permissionCalendarRead')],
		isOptionalPermissions: true,
	},
]
