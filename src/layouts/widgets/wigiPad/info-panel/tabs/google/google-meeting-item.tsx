interface GoogleMeeting {
	id: string
	title: string
	startTime: string
	endTime: string
	meetLink?: string
}

interface GoogleMeetingItemProps {
	meeting: GoogleMeeting
}

export function GoogleMeetingItem({ meeting }: GoogleMeetingItemProps) {
	const handleJoinMeeting = () => {
		if (meeting.meetLink) {
			window.open(meeting.meetLink, '_blank')
		}
	}

	return (
		<div className="p-2 transition-colors rounded-lg bg-base-200 hover:bg-base-300">
			<div className="flex items-center gap-3">
				<div className="text-lg">📹</div>
				<div className="flex-1 min-w-0">
					<h4 className="text-sm font-medium truncate text-base-content">
						{meeting.title}
					</h4>
					<p className="text-xs text-base-content opacity-60">
						{meeting.startTime} - {meeting.endTime}
					</p>
				</div>
				{meeting.meetLink && (
					<button
						onClick={handleJoinMeeting}
						className="px-2 py-1 text-xs transition-colors rounded bg-primary text-primary-content hover:bg-primary-focus"
					>
						پیوستن
					</button>
				)}
			</div>
		</div>
	)
}
