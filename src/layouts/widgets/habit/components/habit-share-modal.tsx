import { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { Icon } from '@/src/icons'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import {
	copyCanvasToClipboard,
	downloadCanvasAsImage,
} from '@/common/utils/canvas'
import { renderHabitShareCanvas } from '../utils/render-habit-share-canvas'

interface HabitShareModalProps {
	isOpen: boolean
	onClose: () => void
	habit: Habit
	color: string
}

export function HabitShareModal({
	isOpen,
	onClose,
	habit,
	color,
}: HabitShareModalProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [isGenerating, setIsGenerating] = useState(false)

	useEffect(() => {
		if (!isOpen || !habit) return
		renderHabitShareCanvas(canvasRef.current, { habit, color })
	}, [isOpen, habit, color])

	const handleCopyImage = async () => {
		setIsGenerating(true)
		await copyCanvasToClipboard(canvasRef.current)
		setIsGenerating(false)
	}

	const handleDownloadImage = () => {
		downloadCanvasAsImage(
			canvasRef.current,
			`عادت-${habit.title || 'habit'}`
		)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			direction="rtl"
			size="xl"
			title={
				<div className="flex items-center gap-2">
					<Icon name="cameraPlus" size={16} />
					<span className="text-sm font-bold text-content">
						اشتراک‌گذاری پیشرفت
					</span>
				</div>
			}
		>
			<div className="flex flex-col gap-4 p-2">
				<div className="flex items-center justify-center overflow-hidden">
					<canvas ref={canvasRef} className="h-auto max-w-full rounded-4xl" />
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2.5 border-t border-base-300">
					<Button variant="ghost" size="sm" rounded="xl" onClick={onClose}>
						بستن
					</Button>

					<div className="self-end space-x-2">
						<Button
							variant="outline"
							size="md"
							rounded="xl"
							onClick={handleCopyImage}
							disabled={isGenerating}
							icon={<Icon name="copy" size={14} />}
						>
							کپی تصویر
						</Button>

						<Button
							variant="primary"
							size="md"
							className="w-32"
							rounded="xl"
							onClick={handleDownloadImage}
							icon={<Icon name="download" size={14} />}
						>
							دانلود تصویر
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	)
}
