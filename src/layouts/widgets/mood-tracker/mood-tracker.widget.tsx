import { useMemo, useState } from 'react'
import { useDate } from '@/context/date.context'
import { useAuth } from '@/context/auth.context'
import { useGetMoods } from '@/services/hooks/mood-log/get-moods.hook'
import {
	type MoodType,
	useUpsertMoodLog,
} from '@/services/hooks/mood-log/upsert-mood-log.hook'
import { useQueryClient } from '@tanstack/react-query'
import { safeAwait } from '@/services/api'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'
import { Mood1x1 } from './variants/mood-1x1'
import { Mood2x1 } from './variants/mood-2x1'
import { Mood2x3 } from './variants/mood-2x3'
import Analytics from '@/analytics'
import type { AxiosError } from 'axios'

interface MoodTrackerWidgetProps {
	size?: WidgetSize
}

export function MoodTrackerWidget({ size = { w: 2, h: 1 } }: MoodTrackerWidgetProps) {
	const queryClient = useQueryClient()
	const { isAuthenticated } = useAuth()
	const { today } = useDate()
	const { mutateAsync: upsertMoodLog, isPending } = useUpsertMoodLog()
	const [optimisticMood, setOptimisticMood] = useState<string | null>(null)

	const startStr = useMemo(() => {
		return today.clone().subtract(6, 'days').doAsGregorian().format('YYYY-MM-DD')
	}, [today])

	const endStr = useMemo(() => {
		return today.clone().doAsGregorian().format('YYYY-MM-DD')
	}, [today])

	const { data: moodsData } = useGetMoods(Boolean(isAuthenticated), startStr, endStr)

	const todayDateStr = useMemo(() => {
		return today.clone().doAsGregorian().format('YYYY-MM-DD')
	}, [today])

	const todayMood = useMemo(() => {
		if (optimisticMood) {
			return {
				date: todayDateStr,
				mood: optimisticMood as any,
			}
		}
		return moodsData?.moods?.find((m) => m.date === todayDateStr)
	}, [optimisticMood, moodsData?.moods, todayDateStr])

	const handleSelectMood = async (moodValue: MoodType) => {
		if (isPending) return
		Analytics.event('mood_widget_clicked')

		setOptimisticMood(moodValue)

		const [error, response] = await safeAwait<
			AxiosError,
			{ action: 'added' | 'removed' }
		>(
			upsertMoodLog({
				mood: moodValue,
				date: todayDateStr,
			})
		)

		if (error) {
			setOptimisticMood(null)
			autoFormatErrorToast(error)
			return
		}

		if (response?.action === 'removed') {
			setOptimisticMood(null)
			showToast('حال روزانه شما حذف شد.', 'info')
		} else {
			setOptimisticMood(moodValue)
			showToast('حال روزانه شما ثبت شد.', 'success', {
				alarmSound: true,
			})
		}

		queryClient.invalidateQueries({ queryKey: ['get-moods'] })
		queryClient.invalidateQueries({ queryKey: ['get-calendar-data'] })
	}

	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer padding={false} className="h-full">
				<Mood1x1
					todayMood={todayMood}
					onSelectMood={handleSelectMood}
					isSaving={isPending}
				/>
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 3) {
		return (
			<WidgetContainer padding={false} className="h-full">
				<Mood2x3
					today={today}
					todayMood={todayMood}
					moods={moodsData?.moods || []}
					onSelectMood={handleSelectMood}
					isSaving={isPending}
				/>
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer padding={false} className="h-full">
			<Mood2x1
				todayMood={todayMood}
				onSelectMood={handleSelectMood}
				isSaving={isPending}
			/>
		</WidgetContainer>
	)
}
