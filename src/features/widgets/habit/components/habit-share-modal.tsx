import { useCallback, useState } from 'react'
import jalaliMoment from 'jalali-moment'
import Analytics from '@/analytics'
import { getCurrentDate } from '@/common/utils/date-events'
import { Button, Modal, Spinner } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { useShareCanvas } from '@/features/widgets/hooks/use-share-canvas'
import {
	copyCanvasToClipboard,
	downloadCanvasAsImage,
} from '@/features/widgets/utils/canvas'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'
import { Icon } from '@/icons'
import type { Habit } from '@/services/habit/habit.interface'
import { habitShareData } from '../utils/habit-share'
import { renderHabitShareCanvas } from '../utils/render-habit-share-canvas'
import { t } from '@/common/i18n'

interface HabitShareModalProps {
	isOpen: boolean
	onClose: () => void
	habit: Habit
	color: string
}

export function HabitShareModal({ isOpen, onClose, habit, color }: HabitShareModalProps) {
	const { selected_timezone: timezone } = useGeneralSetting()
	const { user } = useAuth()
	const [isCopying, setIsCopying] = useState(false)
	const [monthsBack, setMonthsBack] = useState(0)
	const todayKey = toIsoDateKey(getCurrentDate(timezone.value))
	const shareData = habitShareData(habit, todayKey, monthsBack)
	const earliest = Object.values(habit.calendarData ?? {})
		.flatMap((month) => Object.keys(month))
		.sort()[0]
	const currentMonth = jalaliMoment(todayKey, 'YYYY-MM-DD', 'en')
	const earliestMonth = earliest
		? jalaliMoment(earliest, 'YYYY-MM-DD', 'en')
		: currentMonth
	const maxMonthsBack = Math.max(
		11,
		(currentMonth.jYear() - earliestMonth.jYear()) * 12 +
			currentMonth.jMonth() -
			earliestMonth.jMonth()
	)
	const changeMonth = (step: number) => {
		Analytics.event('habit_share_month_changed')
		setMonthsBack((value) => value + step)
	}
	const name = user?.name
	const avatar = user?.avatar || undefined
	const render = useCallback(
		(canvas: HTMLCanvasElement) =>
			renderHabitShareCanvas(canvas, {
				title: habit.title,
				emoji: habit.emoji,
				color,
				userName: name,
				userAvatar: avatar,
				data: habitShareData(habit, todayKey, monthsBack),
			}),
		[habit, color, name, avatar, todayKey, monthsBack]
	)
	const { image, previewRef, failed, retry } = useShareCanvas(render, isOpen)
	const isReady = Boolean(image)

	const handleCopy = async () => {
		setIsCopying(true)
		await copyCanvasToClipboard(image)
		setIsCopying(false)
	}

	const handleDownload = () => {
		downloadCanvasAsImage(
			image,
			t('widgets.habit.share.filename', { p0: habit.title || 'habit' })
		)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			title={t('widgets.habit.share.title')}
			closeLabel={t('ui.common.close')}
		>
			<div className="flex flex-col gap-3.5">
				<div className="flex items-center justify-between gap-2">
					<Button
						size="sm"
						rounded="xl"
						variant="ghost"
						color="base"
						aria-label={t('widgets.moodTracker.shareOlderMonth')}
						disabled={monthsBack >= maxMonthsBack}
						onClick={() => changeMonth(1)}
					>
						<Icon name="chevronRight" size={16} />
					</Button>
					<span
						aria-live="polite"
						className="text-sm font-semibold text-fg-strong"
					>
						{shareData.monthLabel}
					</span>
					<Button
						size="sm"
						rounded="xl"
						variant="ghost"
						color="base"
						aria-label={t('widgets.moodTracker.shareNewerMonth')}
						disabled={monthsBack === 0}
						onClick={() => changeMonth(-1)}
					>
						<Icon name="chevronLeft" size={16} />
					</Button>
				</div>
				{!isReady && !failed && <Spinner size="lg" className="self-center" />}
				{failed && (
					<WidgetError
						message={t('widgets.canvas.imageBuildFailed')}
						onRetry={retry}
					/>
				)}
				<canvas
					hidden={!isReady}
					ref={previewRef}
					role="img"
					aria-label={t('widgets.habit.share.imageAria', {
						p0: habit.title,
					})}
					className="self-center w-auto h-auto max-w-full max-h-[calc(100dvh-13rem)] md:max-h-[calc(min(640px,100dvh-8rem)-7rem)] rounded-2xl"
				/>
				<div className="flex items-center gap-1.5 pt-1">
					<Button
						size="md"
						rounded="xl"
						onClick={handleCopy}
						disabled={!isReady || isCopying}
						icon={<Icon name="copy" size={14} />}
						className="w-1/3"
					>
						{t('widgets.habit.share.copyImage')}
					</Button>
					<Button
						color="brand"
						size="md"
						rounded="xl"
						onClick={handleDownload}
						disabled={!isReady}
						icon={<Icon name="download" size={14} />}
						className="flex-1"
					>
						{t('widgets.habit.share.downloadImage')}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
