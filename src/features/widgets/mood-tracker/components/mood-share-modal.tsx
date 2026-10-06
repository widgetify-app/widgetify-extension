import { useEffect, useRef, useState } from 'react'
import { Button, Modal, Spinner } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { WidgetError } from '@/features/widgets/components/widget-error'
import {
	copyCanvasToClipboard,
	downloadCanvasAsImage,
} from '@/features/widgets/utils/canvas'
import { Icon } from '@/icons'
import { useGetMoodStats } from '@/services/mood-log/get-mood-stats.hook'
import { renderMoodShareCanvas } from '../utils/render-mood-share-canvas'

interface MoodShareModalProps {
	isOpen: boolean
	onClose: () => void
}

export function MoodShareModal({ isOpen, onClose }: MoodShareModalProps) {
	const { user, isAuthenticated } = useAuth()
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [isCopying, setIsCopying] = useState(false)

	const {
		data: statsData,
		isLoading,
		isError,
		refetch,
	} = useGetMoodStats(isOpen && Boolean(isAuthenticated))

	useEffect(() => {
		if (!isOpen || !statsData) return
		renderMoodShareCanvas(canvasRef.current, statsData, user?.name)
	}, [isOpen, statsData, user?.name])

	const handleCopy = async () => {
		setIsCopying(true)
		await copyCanvasToClipboard(canvasRef.current)
		setIsCopying(false)
	}

	const handleDownload = () => {
		const monthName = statsData?.currentJalaliMonthName || 'ماه'
		downloadCanvasAsImage(canvasRef.current, `گزارش-حال-${monthName}`)
	}

	const isReady = isAuthenticated && Boolean(statsData)

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			title="اشتراک‌گذاری حال این ماه"
		>
			<div className="flex flex-col gap-3.5">
				{!isAuthenticated ? (
					<div className="flex flex-col items-center justify-center h-64 gap-2 text-center text-fg-muted">
						<Icon name="alert" size={20} aria-hidden="true" />
						<span className="text-xs leading-relaxed">
							برای ساختن گزارش ماهانه اول وارد حسابت شو
						</span>
					</div>
				) : isLoading ? (
					<div className="flex flex-col items-center justify-center h-64 gap-2 text-fg-muted">
						<Spinner size="lg" aria-hidden="true" />
						<span className="text-xs">دارم تصویر رو آماده می‌کنم…</span>
					</div>
				) : isError ? (
					<div className="h-64">
						<WidgetError
							message="نتونستیم گزارش این ماه رو بیاریم"
							onRetry={() => refetch()}
						/>
					</div>
				) : (
					<canvas
						ref={canvasRef}
						role="img"
						aria-label="تصویر حال این ماه"
						className="self-center w-auto h-auto max-w-full max-h-[60vh] rounded-2xl"
					/>
				)}

				<div className="flex items-center gap-1.5 pt-1">
					<Button
						size="md"
						rounded="xl"
						onClick={handleCopy}
						disabled={!isReady || isCopying}
						icon={<Icon name="copy" size={14} />}
						className="w-1/3"
					>
						کپی تصویر
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
						دانلود تصویر
					</Button>
				</div>
			</div>
		</Modal>
	)
}
