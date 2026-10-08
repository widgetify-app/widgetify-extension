import { t } from '@/common/i18n'
import { Button, SectionPanel } from '@/components/ui'
import { showToast } from '@/common/toast'

interface ReferralCodeSectionProps {
	code: string
	className?: string
}

export const ReferralCodeSection = ({ code, className }: ReferralCodeSectionProps) => {
	const handleCopyCode = async () => {
		try {
			await navigator.clipboard.writeText(code)
			showToast(t('setting.referral.copiedToast'), 'success')
		} catch (error) {
			console.error('Failed to copy code:', error)
			showToast(t('setting.referral.copyError'), 'error')
		}
	}

	return (
		<SectionPanel
			title={
				<div className="flex items-center gap-2">
					<span>{t('setting.referral.yourCodeTitle')}</span>
				</div>
			}
			size="sm"
		>
			<div className="space-y-2">
				<div
					className={`flex items-center justify-between p-4 bg-surface-2 rounded-2xl ${className}`}
				>
					<div>
						<p className="mb-1 text-sm text-fg-muted">
							{t('setting.referral.codeLabel')}
						</p>
						<p className="text-lg font-semibold text-fg">{code}</p>
					</div>
					<Button
						onClick={handleCopyCode}
						size="sm"
						rounded={'xl'}
						color={'brand'}
					>
						{t('setting.referral.copyButton')}
					</Button>
				</div>
				<p className="flex text-sm text-fg-muted gap-0.5 items-center">
					{t('setting.referral.shareHint')}
				</p>
			</div>
		</SectionPanel>
	)
}
