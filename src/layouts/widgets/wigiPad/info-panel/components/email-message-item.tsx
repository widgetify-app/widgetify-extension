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
			className="flex gap-2.5 p-2 rounded-lg bg-base-300/70 hover:bg-base-300 border border-base-300/70 active:scale-98 cursor-pointer transition-all duration-300"
		>
			<div className="pt-0.5">
				<img src={gmailIcon} alt="Gmail" className="w-4 h-4" />
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between">
					<h4 className="text-[13px] font-medium truncate text-content">
						{email.subject}
					</h4>
				</div>
				<p className="mt-0.5 text-xs text-muted font-bold">{email.sender}</p>
				<p className="mt-1 text-[10px] text-muted opacity-80 truncate">
					{email.snippet}
				</p>
			</div>
		</div>
	)
}
