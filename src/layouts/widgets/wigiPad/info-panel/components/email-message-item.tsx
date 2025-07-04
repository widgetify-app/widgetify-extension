interface EmailMessageItemProps {
	email: {
		id: string
		threadId: string
		subject: string
		sender: string
		snippet: string
	}
}

export function EmailMessageItem({ email }: EmailMessageItemProps) {
	const handleClick = () => {
		const gmailUrl = 'https://mail.google.com/mail/u/0/#inbox'
		window.open(gmailUrl, '_blank')
	}

	return (
		<div
			onClick={handleClick}
			className="flex gap-2 p-2 transition-colors rounded-lg cursor-pointer bg-base-200 hover:bg-base-300"
		>
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between mb-1">
					<h4 className="text-xs font-medium truncate text-content">
						{email.subject}
					</h4>
				</div>
				<p className="text-[10px] text-muted font-bold mb-1">{email.sender}</p>
				<p className="text-[10px] text-muted line-clamp-2">{email.snippet}</p>
			</div>
		</div>
	)
}
