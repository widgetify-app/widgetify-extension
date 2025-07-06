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
	if (emailMessages.length === 0) return

	return (
		<div className="space-y-2">
			{emailMessages.map((email, index) => (
				<EmailMessageItem key={index} email={email} />
			))}
		</div>
	)
}
