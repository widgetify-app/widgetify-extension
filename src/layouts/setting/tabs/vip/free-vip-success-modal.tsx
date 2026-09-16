import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Modal } from '@/components/ui/modal/modal'
import { Button } from '@/components/ui/button/button'
import { Icon } from '@/icons'

interface FreeVipSuccessModalProps {
	isOpen: boolean
	onClose: () => void
	days?: number
}

export function FreeVipSuccessModal({
	isOpen,
	onClose,
	days = 5,
}: FreeVipSuccessModalProps) {
	useEffect(() => {
		if (!isOpen) return

		try {
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			})
		} catch {}
	}, [isOpen])

	const handleReload = () => {
		window.location.reload()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="sm"
			direction="rtl"
			closeOnBackdropClick
			title=" "
		>
			<div className="flex flex-col items-center text-center p-2 space-y-4 select-none">
				<div className="flex justify-center">
					<img
						src={'https://cdn.widgetify.ir/extension/success_vip.jpg'}
						alt="Pro access unlocked"
						className="w-32 h-32 object-contain"
					/>
				</div>

				<div className="space-y-1.5">
					<h3 className="text-lg font-black text-content">
						مبارکه! دسترسی پرو باز شد
					</h3>
					<p className="text-xs text-muted leading-relaxed max-w-xs">
						پلن رایگان {days} روزه با موفقیت روی حسابت فعال شد. واسه اعمال و
						دسترسی به تمام قابلیت‌ها، یه بار صفحه رو بارگذاری کنید
					</p>
				</div>

				<div className="flex items-center gap-2 w-full pt-2">
					<Button
						variant="ghost"
						size="md"
						rounded="xl"
						onClick={onClose}
						className="flex-1 text-xs"
					>
						بعدا
					</Button>
					<Button
						variant="solid"
						color="vip"
						size="md"
						rounded="xl"
						onClick={handleReload}
						className="flex-1 text-xs font-bold gap-1.5 shadow-sm"
					>
						<Icon name="refresh" size={14} />
						<span>بارگذاری مجدد</span>
					</Button>
				</div>
			</div>
		</Modal>
	)
}
