import { Button, Modal } from '@/components/ui'

interface CustomUIGuideModalProps {
	isOpen: boolean
	onClose: () => void
}

export function CustomUIGuideModal({ isOpen, onClose }: CustomUIGuideModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="راهنمای حالت شخصی‌سازی (بوم آزاد)"
			direction="rtl"
			size="md"
			showCloseButton={true}
		>
			<div className="flex flex-col gap-3.5 py-1">
				<div className="overflow-hidden rounded-xl ring-2 ring-base-300">
					<video
						src="https://cdn.widgetify.ir/extension/WidgetDrag-b.mp4"
						autoPlay
						loop
						muted
						playsInline
						controls
						className="w-full h-auto aspect-video object-cover"
					/>
				</div>

				<div className="space-y-1 text-right">
					<p className="text-sm font-medium text-content">
						ویجت‌ها رو جابه‌جا کن و چیدمان رو خودت بچین
					</p>
					<p className="text-xs text-muted leading-relaxed">
					 تو این حالت می‌توانید با زدن کلیک راست در وسط صفحه، ویجت‌ها را آزادانه روی صفحه جابه‌جا کنید و اندازه و جایگاه آن‌ها را مطابق سلیقه خودتون پچینید
					</p>
				</div>

				<Button
					size="md"
					variant="primary"
					rounded="xl"
					onClick={onClose}
					className="w-full mt-1 font-bold"
				>
					متوجه شدم
				</Button>
			</div>
		</Modal>
	)
}
