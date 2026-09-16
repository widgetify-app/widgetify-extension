import { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { Icon } from '@/icons'
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
				{!isAuthenticated && (
					<div className="flex flex-col items-center justify-center h-64 gap-2 text-center text-muted">
						<Icon name="alert" size={20} aria-hidden="true" />
						<span className="text-xs leading-relaxed">
							برای ساختن گزارش ماهانه باید وارد حساب کاربریت بشی
						</span>
					</div>
				)}

				{isAuthenticated && isLoading && (
					<div className="flex flex-col items-center justify-center h-64 gap-2 text-muted">
						<span className="loading loading-spinner loading-md text-primary" />
						<span className="text-xs">در حال آماده‌سازی تصویر...</span>
					</div>
				)}

				{isAuthenticated && !isLoading && (
					<div className="flex items-center justify-center overflow-hidden">
						<canvas
							ref={canvasRef}
							className="h-auto max-w-full max-h-[60vh] rounded-2xl elevation-lg border border-subtle"
						/>
					</div>
				)}

				<div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-2.5 border-t border-content">
					<Button variant="ghost" size="sm" rounded="xl" onClick={onClose}>
						بستن
					</Button>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="md"
							rounded="2xl"
							onClick={handleCopyImage}
							disabled={!isAuthenticated || isGenerating || isLoading}
							icon={<Icon name="copy" size={14} />}
						>
							کپی تصویر
						</Button>

						<Button
							color="primary"
							size="md"
							rounded="2xl"
							onClick={handleDownloadImage}
							disabled={!isAuthenticated || isLoading}
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
