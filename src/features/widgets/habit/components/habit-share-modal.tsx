import { useCallback, useState } from 'react'
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
				data: habitShareData(habit, toIsoDateKey(getCurrentDate(timezone.value))),
			}),
		[habit, color, name, avatar, timezone.value]
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
					className="self-center w-auto h-auto max-w-full max-h-[calc(100dvh-12rem)] md:max-h-[calc(min(640px,100dvh-8rem)-6rem)] rounded-2xl"
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
