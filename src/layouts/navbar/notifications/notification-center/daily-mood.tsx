import Analytics from '@/analytics'
import { moodOptions } from '@/common/constants/moods'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { GetUserFirstName } from '@/common/utils/get-firstname'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getCurrentDate } from '@widget/calendar/utils/date-events'
import { safeAwait } from '@/services/api'
import {
	type MoodType,
	useUpsertMoodLog,
} from '@/services/hooks/mood-log/upsert-mood-log.hook'
import { Icon } from '@/icons'
import { useIsMutating, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

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
	const isAdding = useIsMutating({ mutationKey: ['upsertMoodLog'] }) > 0

	const onRemoveNotif = () => {
		callEvent('remove_from_notifications', { id: 'notificationMood', ttl: 420 })
	}

	const handleMoodChange = async (value: string) => {
		if (isAdding) return
		if (value === '') return
		Analytics.event('notifications_daily_moods')
		const currentGregorian = today.clone().doAsGregorian()

		const [error, response] = await safeAwait<
			AxiosError,
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
			showToast(
				'حال روزانت حذف شد. اگه بعدا خواستی دوباره می‌تونی یکی انتخاب کنی.',
				'info'
			)
		} else {
			setMood(value as MoodType)
			showToast('حال روزانه شما با موفقیت ثبت شد.', 'success')
		}

		setTimeout(() => {
			queryClient.invalidateQueries({
				queryKey: ['get-moods'],
			})
			callEvent('remove_from_notifications', {
				id: 'notificationMood',
				ttl: 420,
			})
		}, 1500)
		Analytics.event('notification_mood_clicked')
	}

	return (
		<div
			className={`flex w-full h-20 gap-2 px-2 py-1 transition-all duration-300 border rounded-xl border-surface-3 ${className}`}
			id="notificationMood "
		>
			<div className="flex-1 min-w-0 ">
				<div className="flex items-center justify-between">
					<h4 className="text-3xs font-medium truncate text-fg">
						{GetUserFirstName(user?.name || '')}، امروز حالت چطوره؟
					</h4>
					<button
						type="button"
						className="flex p-0.5 transition-opacity rounded-lg cursor-pointer top-2 left-2 bg-fill text-fg-faint hover:bg-danger-fill hover:text-danger"
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							onRemoveNotif()
						}}
					>
						<Icon name="close" size={14} />
					</button>
				</div>
				<div className="flex justify-around w-full h-10 gap-1 mt-2">
					{moodOptions
						.filter((f) => f.label)
						.map((option) => (
							<div
								key={option.value}
								onClick={() =>
									!isAdding && handleMoodChange(option.value)
								}
								className={`p-1.5 w-full shadow-sm rounded-xl transition-all cursor-pointer ${
									mood === option.value
										? `${option.activeClass} scale-105`
										: `bg-surface-3 hover:bg-fill-2 opacity-80 hover:opacity-100 hover:scale-95`
								}`}
							>
								{isAdding ? (
									<div className="w-5 h-5 mx-auto border-2 border-current rounded-full border-t-transparent animate-spin" />
								) : (
									<div className="flex flex-col items-center gap-0.5 hover:scale-95">
										<div className="text-lg leading-none">
											{option.emoji}
										</div>
										<div className="text-3xs leading-tight">
											{option.label}
										</div>
									</div>
								)}
							</div>
						))}
				</div>
			</div>
		</div>
	)
}
