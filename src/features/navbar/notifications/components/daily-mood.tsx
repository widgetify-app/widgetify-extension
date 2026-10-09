import Analytics from '@/analytics'
import { moodOptions } from '@/common/constants/moods'
import { t } from '@/common/i18n'
import { MoodImage } from '@/components/mood-image'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { GetUserFirstName } from '@/features/navbar/utils/get-firstname'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getCurrentDate } from '@/common/utils/date-events'
import { type ApiError, safeAwait } from '@/services/api'
import { type MoodType, useUpsertMoodLog } from '@/services/mood-log/upsert-mood-log.hook'
import { useIsMutating, useQueryClient } from '@tanstack/react-query'
import { moodLogKeys } from '@/services/mood-log/mood-log.keys'
import { Spinner } from '@/components/ui'
import { NotificationCard, NotificationCloseButton } from './notification-card'

interface Prop {
	className: string
}
export function DailyMoodNotification({ className }: Prop) {
	const queryClient = useQueryClient()
	const { user } = useAuth()
	const { selected_timezone: timezone } = useGeneralSetting()
	const today = getCurrentDate(timezone.value)
	const { mutateAsync: upsertMoodLog } = useUpsertMoodLog()
	const [mood, setMood] = useState<string>()
	const isAdding = useIsMutating({ mutationKey: moodLogKeys.upsert }) > 0

	const onRemoveNotif = () => {
		callEvent('remove_from_notifications', { id: 'notificationMood', ttl: 420 })
	}

	const handleMoodChange = async (value: string) => {
		if (isAdding) return
		if (value === '') return
		Analytics.event('notifications_daily_moods')
		const currentGregorian = today.clone().doAsGregorian()

		const [error, response] = await safeAwait<
			ApiError,
			{ action: 'added' | 'removed' }
		>(
			upsertMoodLog({
				mood: value as MoodType,
				date: currentGregorian.doAsGregorian().format('YYYY-MM-DD'),
			})
		)
		if (error) {
			autoFormatErrorToast(error)
			return
		}

		if (response.action === 'removed') {
			setMood(value)
			showToast(t('navbar.mood.cleared'), 'info')
		} else {
			setMood(value as MoodType)
			showToast(t('navbar.mood.saved'), 'success')
		}

		setTimeout(() => {
			queryClient.invalidateQueries({
				queryKey: moodLogKeys.all,
			})
			callEvent('remove_from_notifications', {
				id: 'notificationMood',
				ttl: 420,
			})
		}, 1500)
		Analytics.event('notification_mood_clicked')
	}

	return (
		<NotificationCard className={className}>
			<div className="flex-1 min-w-0 space-y-2">
				<div className="flex items-center justify-between gap-2">
					<h4 className="text-xs font-semibold truncate text-fg">
						{GetUserFirstName(user?.name || '')}
						{t('navbar.mood.askSuffix')}
					</h4>
					<NotificationCloseButton onClick={onRemoveNotif} />
				</div>
				<div className="grid grid-cols-4 gap-1.5">
					{moodOptions.map((option) => (
						<button
							type="button"
							disabled={isAdding}
							aria-pressed={mood === option.value}
							key={option.value}
							onClick={() => !isAdding && handleMoodChange(option.value)}
							className={`p-1.5 w-full shadow-sm rounded-xl transition-ui cursor-pointer focus-visible:focus-ring ${
								mood === option.value
									? `${option.activeClass} scale-105`
									: `bg-surface-3 hover:bg-fill-2 opacity-80 hover:opacity-100 hover:scale-95`
							}`}
						>
							{isAdding ? (
								<Spinner tone="current" className="mx-auto" />
							) : (
								<div className="flex flex-col items-center gap-0.5">
									<div className="text-lg leading-none">
										<MoodImage mood={option.value} />
									</div>
									<div className="text-3xs leading-tight">
										{t(option.labelKey)}
									</div>
								</div>
							)}
						</button>
					))}
				</div>
			</div>
		</NotificationCard>
	)
}
