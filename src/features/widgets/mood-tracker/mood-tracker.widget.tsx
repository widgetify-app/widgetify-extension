import { useMemo, useState } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import { t } from '@/common/i18n'
import { getCurrentDate } from '@/common/utils/date-events'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'
import { useAuth } from '@/context/auth.context'
import { useGetMoods } from '@/services/mood-log/get-moods.hook'
import { type MoodType, useUpsertMoodLog } from '@/services/mood-log/upsert-mood-log.hook'
import { useQueryClient } from '@tanstack/react-query'
import { type ApiError, safeAwait } from '@/services/api'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { WidgetContainer } from '../components/widget-container'
import { WidgetMenuButton } from '../components/widget-menu-button'
import { useWidgetMenuActions } from '../widget-menu.context'
import type { WidgetSize } from '../utils/layout-engine/types'
import { Mood1x1 } from './variants/mood-tracker-1x1'
import { Mood2x1 } from './variants/mood-tracker-2x1'
import { MoodShareModal } from './components/mood-share-modal'
import { PopoverMenuItem } from '@/components/ui'
import { Icon } from '@/icons'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { moodLogKeys } from '@/services/mood-log/mood-log.keys'

const MOOD_HISTORY_DAYS = 7

interface MoodTrackerWidgetProps {
	size?: WidgetSize
}

export function MoodTrackerWidget({ size = { w: 2, h: 1 } }: MoodTrackerWidgetProps) {
	const queryClient = useQueryClient()
	const { isAuthenticated } = useAuth()
	const { selected_timezone: timezone } = useGeneralSetting()
	const today = getCurrentDate(timezone.value)
	const { mutateAsync: upsertMoodLog, isPending } = useUpsertMoodLog()
	const [optimisticMood, setOptimisticMood] = useState<MoodType | null>(null)
	const [isShareModalOpen, setIsShareModalOpen] = useState(false)

	const todayDateStr = toIsoDateKey(today)
	const startStr = toIsoDateKey(today.clone().subtract(MOOD_HISTORY_DAYS - 1, 'days'))

	const { data: moodsData } = useGetMoods(
		Boolean(isAuthenticated),
		startStr,
		todayDateStr
	)

	const todayMood = useMemo(() => {
		if (optimisticMood) {
			return { date: todayDateStr, mood: optimisticMood }
		}
		return moodsData?.moods?.find((m) => m.date?.startsWith(todayDateStr))
	}, [optimisticMood, moodsData?.moods, todayDateStr])

	const handleSelectMood = async (moodValue: MoodType, targetDateStr?: string) => {
		if (!isAuthenticated) {
			callEvent('open_require_auth_modal')
			return
		}
		if (isPending) return
		Analytics.event('mood_widget_clicked')

		const dateToLog = targetDateStr || todayDateStr

		if (dateToLog === todayDateStr) {
			setOptimisticMood(moodValue)
		}

		const [error, response] = await safeAwait<
			ApiError,
			{ action: 'added' | 'removed' }
		>(
			upsertMoodLog({
				mood: moodValue,
				date: dateToLog,
			})
		)

		if (error) {
			if (dateToLog === todayDateStr) {
				setOptimisticMood(null)
			}
			autoFormatErrorToast(error)
			return
		}

		if (response?.action === 'removed') {
			if (dateToLog === todayDateStr) {
				setOptimisticMood(null)
			}
			showToast(t('widgets.moodTracker.toast.cleared'), 'info')
		} else {
			if (dateToLog === todayDateStr) {
				setOptimisticMood(moodValue)
			}
			showToast(t('widgets.moodTracker.toast.saved'), 'success')
		}

		queryClient.invalidateQueries({ queryKey: moodLogKeys.all })
	}

	const handleOpenShare = () => {
		setIsShareModalOpen(true)
		Analytics.event('mood_share_modal_opened')
	}

	useWidgetMenuActions(
		<PopoverMenuItem
			icon={<Icon name="camera" size={14} aria-hidden="true" />}
			label={t('widgets.moodTracker.shareMonth')}
			onClick={handleOpenShare}
		/>
	)

	const isSquare = size.w === 1 && size.h === 1

	return (
		<>
			<WidgetContainer contentClassName={isSquare ? 'p-2' : 'px-2.5 pt-2 pb-2.5'}>
				{isSquare ? (
					<>
						<Mood1x1
							todayMood={todayMood}
							onSelectMood={handleSelectMood}
							isSaving={isPending}
						/>
						<WidgetMenuButton placement="floating" />
					</>
				) : (
					<Mood2x1
						todayMood={todayMood}
						onSelectMood={handleSelectMood}
						isSaving={isPending}
					/>
				)}
			</WidgetContainer>

			<MoodShareModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
			/>
		</>
	)
}
