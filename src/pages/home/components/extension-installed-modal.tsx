import keepItImage from '@/assets/images/keep-it.png'
import { Button } from '@/components/ui'
import { Modal } from '@/components/ui'
import { StepFirefoxConsent } from './step-firefox-consent'

interface ExtensionInstalledModalProps {
	show: boolean
	onClose: () => void
	onGetStarted: () => void
}
export function ExtensionInstalledModal({
	show,
	onGetStarted,
}: ExtensionInstalledModalProps) {
	return (
		<Modal
			isOpen={show}
			onClose={() => {}}
			size="sm"
			showCloseButton={false}
			closeOnBackdropClick={false}
		>
			{import.meta.env.FIREFOX ? (
				<StepFirefoxConsent onGetStarted={onGetStarted} />
			) : (
				<StepOne onGetStarted={onGetStarted} />
			)}
		</Modal>
	)
}
interface StepOneProps {
	onGetStarted: () => void
}
const StepOne = ({ onGetStarted }: StepOneProps) => {
	return (
		<>
			<div className="mb-3">
				<h3 className={'text-center text-2xl font-bold text-fg'}>
					به ویجتیفای خوش اومدی!
				</h3>
			</div>

			<div
				className={
					'relative p-1 mt-1 mb-3 border rounded-xl border-surface-3 bg-surface-2'
				}
			>
				<div className="flex items-center justify-center">
					<img
						src={keepItImage}
						alt="نحوه فعالسازی افزونه"
						className="h-auto max-w-full rounded-lg shadow-xl"
						style={{ maxHeight: '220px' }}
					/>
				</div>
			</div>

			<div
				className={
					'p-3 mb-2 text-fg rounded-lg border border-surface-3  bg-surface-2'
				}
			>
				<p className="font-bold text-fg-muted">
					⚠️ برای فعال شدن افزونه، دکمه‌ی "Keep It" رو بزن.
				</p>
			</div>

			<Button
				size="md"
				onClick={onGetStarted}
				className="w-full text-base font-light shadow-sm rounded-2xl shadow-brand outline-none!"
				color="brand"
			>
				شروع کنیم
			</Button>
		</>
	)
}
