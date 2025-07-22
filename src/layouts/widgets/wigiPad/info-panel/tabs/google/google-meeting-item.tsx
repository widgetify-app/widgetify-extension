import moment from 'jalali-moment'
import { MdDateRange, MdEvent, MdLocationOn, MdVideoCall } from 'react-icons/md'
import type { GoogleCalendarEvent } from '@/services/hooks/date/getGoogleCalendarEvents.hook'

interface GoogleEventItemProps {
	meeting: GoogleCalendarEvent
}

function formatEventTime(dateTimeStr: string) {
	if (!dateTimeStr) return null
	const date = new Date(dateTimeStr)
	return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

export function GoogleMeetingItem({ meeting }: GoogleEventItemProps) {
	const handleJoinMeeting = () => {
		const meetLink =
			meeting.hangoutLink ||
			meeting.conferenceData?.entryPoints?.find(
				(ep: any) => ep.entryPointType === 'video'
			)?.uri ||
			meeting.htmlLink

		if (meetLink) {
			window.open(meetLink, '_blank')
		}
	}

	const meetLink =
		meeting.hangoutLink ||
		meeting.conferenceData?.entryPoints?.find(
			(ep: any) => ep.entryPointType === 'video'
		)?.uri
	const getEventIcon = () => {
		if (meetLink) return <MdVideoCall className="text-blue-500" />
		if (meeting.location) return <MdLocationOn className="text-red-500" />
		return <MdEvent className="text-gray-500" />
	}

	return (
		<div
			className="p-2 transition-colors rounded-lg cursor-pointer bg-content hover:!bg-base-300"
			onClick={handleJoinMeeting}
		>
			<div className="flex items-center gap-3">
				<div className="text-lg">{getEventIcon()}</div>{' '}
				<div className="flex-1 min-w-0">
					<h4 className="text-sm font-medium truncate text-base-content">
						{meeting.summary}
					</h4>
					<p className="flex items-center gap-1 text-xs text-muted">
						<MdDateRange className="text-content" />
						{moment(meeting.start.dateTime)
							.locale('fa')
							.format('dddd، jD jMMMM jYYYY') || 'نامشخص'}
					</p>
					<p className="flex items-center gap-1 text-xs text-muted">
						{formatEventTime(meeting.start.dateTime) || 'نامشخص'} -{' '}
						{formatEventTime(meeting.end.dateTime) || 'نامشخص'}
					</p>
					{meeting.location && (
						<p className="flex items-center gap-1 mt-1 text-xs truncate text-muted">
							<MdLocationOn className="text-red-500" />
							{meeting.location}
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
