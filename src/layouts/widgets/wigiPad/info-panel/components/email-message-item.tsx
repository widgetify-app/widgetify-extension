import gmailIcon from '@/assets/gmail.svg'
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
			className="flex gap-2 p-2 transition-all rounded-lg bg-base-300/90 border border-base-300/70 cursor-pointer"
		>
			<div className="">
				<img src={gmailIcon} alt="Gmail" className="w-4 h-4" />
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between mb-1">
					<h4 className="text-xs font-medium truncate text-content">
						{email.subject}
					</h4>
				</div>
				<p className="text-[11px] text-muted font-bold mb-1">{email.sender}</p>
				<p className="text-[10px] text-muted opacity-80 truncate">
					{email.snippet}
				</p>
			</div>
		</div>
	)
}
