import { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import {
	copyCanvasToClipboard,
	downloadCanvasAsImage,
} from '@/features/widgets/utils/canvas'
import { Icon } from '@/icons'
import type { Habit } from '@/services/habit/habit.interface'
import { renderHabitShareCanvas } from '../utils/render-habit-share-canvas'
import { t } from '@/common/i18n'

interface HabitShareModalProps {
	isOpen: boolean
	onClose: () => void
	habit: Habit
	color: string
}

export function HabitShareModal({ isOpen, onClose, habit, color }: HabitShareModalProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [isCopying, setIsCopying] = useState(false)

	useEffect(() => {
		if (!isOpen) return
		renderHabitShareCanvas(canvasRef.current, { habit, color })
	}, [isOpen, habit, color])

	const handleCopy = async () => {
		setIsCopying(true)
		await copyCanvasToClipboard(canvasRef.current)
		setIsCopying(false)
	}

	const handleDownload = () => {
		downloadCanvasAsImage(
			canvasRef.current,
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
				<canvas
					ref={canvasRef}
					role="img"
					aria-label={t('widgets.habit.share.imageAria', {
						p0: habit.title,
					})}
					className="self-center w-auto h-auto max-w-full max-h-[60vh] rounded-2xl"
				/>
				<div className="flex items-center gap-1.5 pt-1">
					<Button
						size="md"
						rounded="xl"
						onClick={handleCopy}
						disabled={isCopying}
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
