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
		>
			<div className="flex flex-col items-center text-center p-2 space-y-4 select-none">
				<div className="relative">
					<div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center animate-bounce">
						<Icon name="gift" size={32} />
					</div>
					<div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-vip text-white flex items-center justify-center shadow-sm">
						<Icon name="diamond" size={12} />
					</div>
				</div>

				<div className="space-y-1.5">
					<h3 className="text-lg font-black text-content">
						مبارکه! دسترسی پرو باز شد 🎉
					</h3>
					<p className="text-xs text-muted leading-relaxed max-w-xs">
						پلن رایگان {days} روزه با موفقیت روی حسابت فعال شد. واسه اعمال بهتر
						تغییرات و لود تمام فیچرها، یه بار صفحه رو بارگذاری مجدد کن
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
						بعداً
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
