import { EmailMessageItem } from '../../components/email-message-item'

interface EmailTabProps {
	emailMessages: Array<{
		id: string
		threadId: string
		subject: string
		sender: string
		snippet: string
	}>
}

export function EmailTab({ emailMessages }: EmailTabProps) {
	if (emailMessages.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-2 text-center">
				<div className="mb-1 text-3xl">📧</div>
				<p className="text-sm text-muted">پیام ایمیلی موجود نیست</p>
			</div>
		)
	}

	return (
		<div className="space-y-2">
			{emailMessages.map((email, index) => (
				<EmailMessageItem key={index} email={email} />
			))}
		</div>
	)
}
