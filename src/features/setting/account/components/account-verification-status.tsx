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
		<SectionPanel title="وضعیت تایید حساب" size="xs" delay={0.1}>
			<Alert
				tone="warning"
				icon="mail"
				title="حساب شما تایید نشده است"
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
								در حال ارسال...
							</>
						) : (
							<>
								<Icon name="mail" size={16} />
								ارسال ایمیل تایید
							</>
						)}
					</Button>
				}
			>
				لطفا ایمیل خود را بررسی کنید یا ایمیل جدید درخواست کنید.
			</Alert>
		</SectionPanel>
	)
}
