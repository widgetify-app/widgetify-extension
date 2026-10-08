import { useState } from 'react'
import { t } from '@/common/i18n'
import { Button, ItemSelector } from '@/components/ui'
import { Icon } from '@/icons'
import { getFromStorage, setFaviconConsent, setToStorage } from '@/common/storage'

interface StepFirefoxConsentProps {
	onGetStarted: () => void
}

export const StepFirefoxConsent = ({ onGetStarted }: StepFirefoxConsentProps) => {
	const [allowIcon, setAllowIcon] = useState(true)
	const [allowAnalytics, setAllowAnalytics] = useState(true)

	const handleDecline = () => {
		if (browser.management?.uninstallSelf) {
			// @ts-expect-error browser.management type definition in firefox
			browser.management.uninstallSelf({
				showConfirmDialog: true,
				dialogMessage: t('home.firefox.uninstallConfirm'),
			})
		}
	}

	const handleConfirm = async () => {
		const current = (await getFromStorage('generalSettings')) || {}
		await setToStorage('generalSettings', {
			...current,
			analyticsEnabled: allowAnalytics,
		})
		setFaviconConsent(allowIcon)

		onGetStarted()
	}

	return (
		<div className="flex flex-col gap-3 text-right">
			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-fg">
						{t('home.firefox.privacyTitle')}
					</h3>
					<span className="text-2xs font-medium px-2 py-0.5 rounded-lg bg-fill-2 text-fg-muted">
						Privacy Notice
					</span>
				</div>
				<p className="text-xs text-fg-muted leading-relaxed">
					{t('home.firefox.privacyBody')}
				</p>
			</div>

			<div className="space-y-2">
				<ItemSelector
					isActive={allowIcon}
					onClick={() => setAllowIcon(!allowIcon)}
					label={t('home.firefox.faviconTitle')}
					description={t('home.firefox.faviconBody')}
				/>

				<ItemSelector
					isActive={allowAnalytics}
					onClick={() => setAllowAnalytics(!allowAnalytics)}
					label={t('home.firefox.analyticsTitle')}
					description={t('home.firefox.analyticsBody')}
				/>
			</div>

			<div className="flex items-center justify-between text-2xs text-fg-muted pt-1">
				<span>{t('home.firefox.changeLater')}</span>
				<a
					href="https://widgetify.ir/privacy"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1 text-brand hover:underline"
				>
					<Icon name="externalLink" className="w-3 h-3" />
					{t('home.firefox.privacyPolicy')}
				</a>
			</div>

			<div className="flex items-center gap-2 pt-2 border-t border-line">
				<Button
					onClick={handleDecline}
					size="md"
					variant="ghost"
					color="danger"
					rounded="2xl"
					className="flex-1 text-xs"
				>
					{t('home.firefox.removeExtension')}
				</Button>
				<Button
					onClick={handleConfirm}
					size="md"
					color="brand"
					rounded="2xl"
					className="flex-1 text-xs"
				>
					{t('home.firefox.confirmContinue')}
				</Button>
			</div>
		</div>
	)
}
