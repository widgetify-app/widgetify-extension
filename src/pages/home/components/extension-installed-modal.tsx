import welcomeArt from '@/assets/images/onboarding/welcome.webp'
import { t } from '@/common/i18n'
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
					{t('home.installed.welcome')}
				</h3>
			</div>

			<img
				src={welcomeArt}
				alt={t('home.installed.howToEnable')}
				className="object-cover w-full mt-1 mb-3 aspect-2/1 rounded-2xl"
			/>

			<div
				className={
					'p-3 mb-2 text-fg rounded-lg border border-surface-3  bg-surface-2'
				}
			>
				<p className="font-bold text-fg-muted">
					{t('home.installed.keepItWarning')}
				</p>
			</div>

			<Button
				size="md"
				onClick={onGetStarted}
				className="w-full text-base font-light shadow-sm rounded-2xl shadow-brand outline-none!"
				color="brand"
			>
				{t('home.installed.start')}
			</Button>
		</>
	)
}
