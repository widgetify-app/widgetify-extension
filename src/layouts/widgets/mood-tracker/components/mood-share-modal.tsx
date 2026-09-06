import { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { Icon } from '@/src/icons'
import { useAuth } from '@/context/auth.context'
import { copyCanvasToClipboard, downloadCanvasAsImage } from '@/common/utils/canvas'
import { useGetMoodStats } from '@/services/hooks/mood-log/get-mood-stats.hook'
import { renderMoodShareCanvas } from '../utils/render-mood-share-canvas'

interface MoodShareModalProps {
	isOpen: boolean
	onClose: () => void
}

export function MoodShareModal({ isOpen, onClose }: MoodShareModalProps) {
	const { user, isAuthenticated } = useAuth()
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [isGenerating, setIsGenerating] = useState(false)

	const { data: statsData, isLoading } = useGetMoodStats(
		isOpen && Boolean(isAuthenticated)
	)

	useEffect(() => {
		if (!isOpen || !statsData) return
		renderMoodShareCanvas(canvasRef.current, statsData, user?.name)
	}, [isOpen, statsData, user?.name])

	const handleCopyImage = async () => {
		setIsGenerating(true)
		await copyCanvasToClipboard(canvasRef.current)
		setIsGenerating(false)
	}

	const handleDownloadImage = () => {
		const monthName = statsData?.currentJalaliMonthName || 'ماه'
		downloadCanvasAsImage(canvasRef.current, `گزارش-حال-${monthName}`)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			direction="rtl"
			size="md"
			title={
				<div className="flex items-center gap-2">
					<Icon name="cameraPlus" size={16} />
					<span className="text-sm font-bold text-content">
						اشتراک‌گذاری حال این ماه
					</span>
				</div>
			}
		>
			<div className="flex flex-col gap-4 p-2">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center h-64 gap-2 text-muted">
						<span className="loading loading-spinner loading-md text-primary" />
						<span className="text-xs">در حال آماده‌سازی تصویر...</span>
					</div>
				) : (
					<div className="flex items-center justify-center overflow-hidden">
						<canvas
							ref={canvasRef}
							className="h-auto max-w-full max-h-[60vh] rounded-2xl shadow-lg border border-base-content/10"
						/>
					</div>
				)}

				<div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-2.5 border-t border-base-300">
					<Button variant="ghost" size="sm" rounded="xl" onClick={onClose}>
						بستن
					</Button>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="md"
							rounded="xl"
							onClick={handleCopyImage}
							disabled={isGenerating || isLoading}
							icon={<Icon name="copy" size={14} />}
						>
							کپی تصویر
						</Button>

						<Button
							variant="primary"
							size="md"
							rounded="xl"
							onClick={handleDownloadImage}
							disabled={isLoading}
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
