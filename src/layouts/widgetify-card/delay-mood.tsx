import Analytics from '@/analytics'
import { moodOptions } from '@/common/constant/moods'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/context/date.context'
import { safeAwait } from '@/services/api'
import {
	type MoodType,
	useUpsertMoodLog,
} from '@/services/hooks/moodLog/upsert-moodLog.hook'
import { translateError } from '@/utils/translate-error'
import { useIsMutating, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { HiXMark } from 'react-icons/hi2'

export function DelayMoodNotification() {
	const queryClient = useQueryClient()
	const { user } = useAuth()
	const { today } = useDate()
	const { mutateAsync: upsertMoodLog } = useUpsertMoodLog()
	const [mood, setMood] = useState<string>()
	const isAdding = useIsMutating({ mutationKey: ['upsertMoodLog'] }) > 0

	const onRemoveNotif = () => {
		callEvent('remove_from_notifications', { id: 'notificationMood', ttl: 1440 })
	}

	const handleMoodChange = async (value: string) => {
		if (isAdding) return
		if (value === '') return

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
			const msg = translateError(error)
			showToast(msg as any, 'error')
			return
		}

		if (response.action === 'removed') {
			setMood(value)
			showToast(
				'مودت حذف شد. اگه بعداً خواستی دوباره می‌تونی یکی انتخاب کنی.',
				'info'
			)
		} else {
			setMood(value as MoodType)
			showToast('مود شما با موفقیت ثبت شد.', 'success', {
				alarmSound: true,
			})
		}

		setTimeout(() => {
			queryClient.invalidateQueries({
				queryKey: ['get-calendar-data'],
			})
			callEvent('remove_from_notifications', {
				id: 'notificationMood',
				ttl: 1440,
			})
		}, 1500)
		Analytics.event('notification_mood_clicked')
	}

	return (
		<div
			className="flex w-full h-20 gap-2 px-2 py-1 transition-all duration-300 border rounded-xl bg-base-300/70 border-base-300/70"
			id="notificationMood "
		>
			<div className="flex-1 min-w-0 ">
				<div className="flex items-center justify-between">
					<h4 className="text-[10px] font-medium truncate text-content">
						{user?.name}، امروز حالت چطوره؟
					</h4>
					<button
						type="button"
						className="flex p-0.5 transition-opacity rounded-md cursor-pointer top-2 left-2 bg-base-content/5 text-base-content/40 hover:bg-error/10 hover:text-error"
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							onRemoveNotif()
						}}
					>
						<HiXMark size={14} />
					</button>
				</div>
				<div className="flex justify-around w-full h-10 mt-2 gap-0.5">
					{moodOptions.map((option) => (
						<div
							key={option.value}
							onClick={() => !isAdding && handleMoodChange(option.value)}
							className={`p-1.5 w-full border border-content rounded-xl transition-all cursor-pointer ${
								mood === option.value
									? `bg-${option.colorClass} text-${option.colorClass}-content scale-105`
									: `bg-base-300 hover:bg-base-300/70 opacity-80 hover:opacity-100 hover:scale-95`
							}`}
						>
							{isAdding ? (
								<div className="w-5 h-5 mx-auto border-2 border-white rounded-full border-t-transparent animate-spin" />
							) : (
								<div className="flex flex-col items-center gap-0.5 hover:scale-95">
									<div className="text-lg leading-none">
										{option.emoji}
									</div>
									<div className="text-[10px] leading-tight">
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
