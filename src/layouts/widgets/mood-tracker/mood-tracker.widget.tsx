import { useMemo, useRef, useState } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getCurrentDate } from '@widget/calendar/utils/date-events'
import { toIsoDateKey } from '@widget/calendar/utils/jalali-date'
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
import { Mood1x1 } from './variants/mood-tracker-1x1'
import { Mood2x1 } from './variants/mood-tracker-2x1'
import { MoodShareModal } from './components/mood-share-modal'
import { PopoverMenu, PopoverMenuItem, PopoverMenuHeader } from '@/components/ui'
import { Icon } from '@/icons'
import Analytics from '@/analytics'
import type { AxiosError } from 'axios'
import { callEvent } from '@/common/utils/call-event'

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
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isShareModalOpen, setIsShareModalOpen] = useState(false)
	const menuTriggerRef = useRef<HTMLButtonElement | null>(null)

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
			AxiosError,
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
			showToast('حال روزانه شما حذف شد.', 'info')
		} else {
			if (dateToLog === todayDateStr) {
				setOptimisticMood(moodValue)
			}
			showToast('حال روزانه شما ثبت شد.', 'success')
		}

		queryClient.invalidateQueries({ queryKey: ['get-moods'] })
		queryClient.invalidateQueries({ queryKey: ['get-calendar-data'] })
	}

	const handleOpenMenu = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsMenuOpen((prev) => !prev)
	}

	const handleOpenShare = () => {
		setIsMenuOpen(false)
		setIsShareModalOpen(true)
		Analytics.event('mood_share_modal_opened')
	}

	return (
		<>
			<WidgetContainer padding={false} className="h-full">
				{size.w === 1 && size.h === 1 ? (
					<Mood1x1
						todayMood={todayMood}
						onSelectMood={handleSelectMood}
						isSaving={isPending}
						onOpenMenu={handleOpenMenu}
						menuTriggerRef={menuTriggerRef}
					/>
				) : (
					<Mood2x1
						todayMood={todayMood}
						onSelectMood={handleSelectMood}
						isSaving={isPending}
						onOpenMenu={handleOpenMenu}
						menuTriggerRef={menuTriggerRef}
					/>
				)}
			</WidgetContainer>

			<PopoverMenu
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				triggerRef={menuTriggerRef}
				width={180}
				placement="bottom-end"
			>
				<PopoverMenuHeader>
					<span>حال روزانه</span>
				</PopoverMenuHeader>
				<PopoverMenuItem
					icon={<Icon name="cameraPlus" size={14} aria-hidden="true" />}
					label="اشتراک‌گذاری ماه"
					onClick={handleOpenShare}
				/>
			</PopoverMenu>

			<MoodShareModal
				isOpen={isShareModalOpen}
				onClose={() => setIsShareModalOpen(false)}
			/>
		</>
	)
}
