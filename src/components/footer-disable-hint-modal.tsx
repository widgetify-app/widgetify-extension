import { Button } from './button/button'
import Modal from './modal'

interface FooterDisableHintModalProps {
	show: boolean
	onClose: () => void
}

export function FooterDisableHintModal({ show, onClose }: FooterDisableHintModalProps) {
	return (
		<Modal
			isOpen={show}
			onClose={onClose}
			size="sm"
			direction="rtl"
			showCloseButton={true}
			closeOnBackdropClick={true}
		>
			<div className={'flex flex-col items-center text-center w-full'}>
				<div className="mb-2">
					<h3 className={'mb-0 text-2xl font-bold text-content'}>
						💡 نکته مفید
					</h3>
				</div>

				<div
					className={
						'relative p-1 mt-1 mb-3 border rounded-xl border-content bg-content'
					}
				>
					<div className="flex items-center justify-center">
						<img
							src="https://cdn.widgetify.ir/extension/how-to-disable-footer.png"
							alt="نحوه مخفی کردن نوار پایین مرورگر"
							className="h-auto max-w-full rounded-lg shadow-xl"
							style={{ maxHeight: '220px' }}
						/>
					</div>
				</div>

				<div
					className={
						'p-3 mb-3 text-content rounded-lg border border-content  bg-content'
					}
				>
					<p className="font-bold text-muted">
						💡 برای زیبایی بیشتر، میتونید نوار خاکستری پایین مرورگر رو (در
						صورتی که فعال هست) مانند این تصویر مخفی کنید
					</p>
				</div>

				<div className="flex flex-col w-full gap-4 mt-4 sm:flex-row">
					<Button
						size="md"
						className="w-full btn rounded-2xl backdrop-blur-sm"
						isPrimary={true}
						onClick={onClose}
					>
						متوجه شدم
					</Button>
				</div>
			</div>
		</Modal>
	)
}
