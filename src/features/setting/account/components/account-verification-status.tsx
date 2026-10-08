import { t } from '@/common/i18n'
import { Alert, Button, SectionPanel, Spinner } from '@/components/ui'
import { Icon } from '@/icons'

interface AccountVerificationStatusProps {
	sendVerificationMutation: {
		isPending: boolean
	}
	onSendVerificationEmail: () => void
}

export const AccountVerificationStatus = ({
	sendVerificationMutation,
	onSendVerificationEmail,
}: AccountVerificationStatusProps) => {
	return (
		<SectionPanel title={t('setting.verification.title')} size="xs" delay={0.1}>
			<Alert
				tone="warning"
				icon="mail"
				title={t('setting.verification.unverifiedHint')}
				action={
					<Button
						onClick={onSendVerificationEmail}
						disabled={sendVerificationMutation.isPending}
						className="px-3 py-2 text-xs transition-colors rounded-2xl"
						color="warning"
						size="sm"
					>
						{sendVerificationMutation.isPending ? (
							<>
								<Spinner size="sm" tone="image" />
								{t('setting.verification.sending')}
							</>
						) : (
							<>
								<Icon name="mail" size={16} />
								{t('setting.verification.sendEmail')}
							</>
						)}
					</Button>
				}
			>
				{t('setting.verification.checkInboxHint')}
			</Alert>
		</SectionPanel>
	)
}
