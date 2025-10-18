import moment from 'jalali-moment'
import { CgMediaLive } from 'react-icons/cg'
import { MdDateRange, MdLocationOn } from 'react-icons/md'
import GoogleCalendar from '@/assets/google-calendar.png'
import Tooltip from '@/components/toolTip'
import { getCurrentDate } from '@/layouts/widgets/calendar/utils'
import type { GoogleCalendarEvent } from '@/services/hooks/date/getGoogleCalendarEvents.hook'

interface GoogleEventItemProps {
	meeting: GoogleCalendarEvent
	timezone: string
}

function formatEventTime(dateTimeStr: string) {
	if (!dateTimeStr) return null
	const date = new Date(dateTimeStr)
	return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

export function GoogleMeetingItem({ meeting, timezone }: GoogleEventItemProps) {
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

	const isPastEvent = () => {
		if (!meeting.end || !meeting.end.dateTime) return false
		const endDate = new Date(meeting.end.dateTime)
		const now = getCurrentDate(timezone).toDate()
		return endDate < now
	}

	const isCurrentEvent = () => {
		if (
			!meeting.start ||
			!meeting.start.dateTime ||
			!meeting.end ||
			!meeting.end.dateTime
		)
			return false
		const startDate = new Date(meeting.start.dateTime)
		const endDate = new Date(meeting.end.dateTime)
		const now = getCurrentDate(timezone).toDate()
		return startDate <= now && endDate >= now
	}

	return (
		<div
			className={`p-2 bg-content cursor-pointer relative hover:bg-base-300 transition-all overflow-hidden rounded-2xl ${
				isPastEvent() ? 'opacity-70 pointer-events-none' : 'hover:scale-95'
			}`}
			onClick={handleJoinMeeting}
		>
			{isPastEvent() && (
				<div className="absolute px-2 py-0.5 text-xs transform -rotate-45 shadow-xl text-warning-content -left-10 w-32 top-4 bg-warning/80">
					<div className="relative z-10 font-normal tracking-wide text-center">
						اتمام یافته
					</div>
				</div>
			)}
			{isCurrentEvent() && (
				<div className="absolute grid w-4 h-4 transition-all rounded-full left-2 place-items-center animate-ping">
					<Tooltip content="در حال برگزاری...">
						<CgMediaLive className="text-content" size={14} />
					</Tooltip>
				</div>
			)}
			<div className="flex items-center gap-3">
				<div className="text-lg">
					<img
						src={GoogleCalendar}
						alt="Gmail"
						className="w-[1.2rem] h-[1.2rem]"
					/>
				</div>{' '}
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
