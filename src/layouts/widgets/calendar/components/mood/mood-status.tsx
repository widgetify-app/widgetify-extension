import { RequireAuth } from '@/components/auth/require-auth'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useGetUserMoodStatus } from '@/services/hooks/user/userService.hook'

export const moodOptions = [
	{ value: 'sad', emoji: '😔', label: 'ناراحتم', colorClass: 'bg-error/20' },
	{ value: 'tired', emoji: '😴', label: 'خستم', colorClass: 'bg-warning/20' },
	{ value: 'happy', emoji: '🙂', label: 'اوکی‌ام', colorClass: 'bg-secondary/20' },
	{ value: 'excited', emoji: '😄', label: 'سرحالم', colorClass: 'bg-success/20' },
]

const getMoodOption = (value: string | null) => {
	if (!value) return null
	if (value === 'normal') value = 'tired'
	return moodOptions.find((m) => m.value === value) ?? null
}

export function CompactMoodWidget() {
	const { isAuthenticated } = useAuth()
	const { data } = useGetUserMoodStatus(isAuthenticated)
	if (!isAuthenticated)
		return (
			<RequireAuth>
				<></>
			</RequireAuth>
		)

	if (!data)
		return (
			<div className="flex flex-col h-full gap-1 p-2">
				<div className="flex items-center justify-between">
					<span className="w-10 h-2 skeleton"></span>

					<div className="flex items-center gap-1">
						<span className="w-8 h-3 skeleton"></span>🔥
					</div>
				</div>

				<div className="grid grid-cols-7 gap-0.5 mt-2">
					{[...Array(30)].map((_, linkIdx) => (
						<div
							className="w-5 h-5 rounded-lg skeleton"
							key={`w-${linkIdx}`}
						></div>
					))}
				</div>

				<div className="flex flex-wrap gap-2 mt-auto text-xs">
					{moodOptions.map((opt) => (
						<div key={opt.value} className="flex items-center gap-1">
							<div className={`h-2 w-2 rounded ${opt.colorClass}`} />
							<span>{opt.label}</span>
						</div>
					))}
				</div>
			</div>
		)

	const { month, year, streak, days } = data

	return (
		<div className="flex flex-col h-full gap-1 p-2">
			<div className="flex items-center justify-between">
				<div className="font-semibold text-[12px]">
					{month} / {year}{' '}
					<span className="mr-1 text-white badge badge-primary badge-xs outline-2 outline-primary/20">
						آزمایشی
					</span>
				</div>
				<span>{streak} 🔥 </span>
			</div>

			<div className="grid grid-cols-7 gap-[2px] mt-2">
				{days.map((day: any, i: number) => {
					const moodOpt = getMoodOption(day.mood)
					return (
						<Tooltip
							content={moodOpt?.label || 'ثبت نشده'}
							key={`user-mood-${i}`}
						>
							<div
								title={`${day.date} - ${moodOpt?.label ?? 'ثبت نشده'}`}
								className={`
                h-5 w-5 rounded-lg flex items-center justify-center text-[10px]
                ${moodOpt ? `${moodOpt.colorClass}` : 'bg-base-content/5'}
              `}
							>
								{moodOpt?.emoji}
							</div>
						</Tooltip>
					)
				})}
			</div>

			<div className="flex flex-wrap gap-2 mt-auto text-xs">
				{moodOptions.map((opt) => (
					<div key={opt.value} className="flex items-center gap-1">
						<div className={`h-2 w-2 rounded ${opt.colorClass}`} />
						<span>{opt.label}</span>
					</div>
				))}
			</div>
		</div>
	)
}
