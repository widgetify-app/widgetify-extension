import Tooltip from '@/components/toolTip'
import { HiOutlineMapPin, HiOutlineVideoCamera } from 'react-icons/hi2'

interface CalendarEventProps {
	event: any
	isToday: boolean
	currentTime: Date
	hourHeight: number
	onEventClick: (event: any) => void
	getInitials: (email: string) => string
}

export const CalendarEvent = ({
	event,
	isToday,
	currentTime,
	onEventClick,
	getInitials,
	hourHeight,
}: CalendarEventProps) => {
	const start = new Date(event.start.dateTime)
	const end = new Date(event.end.dateTime)
	const isNow = isToday && currentTime >= start && currentTime <= end
	const duration = (end.getTime() - start.getTime()) / 60000
	const isShort = duration <= 45
	const hasAction = !!(event.hangoutLink || event.location)
	const isEnd = end <= currentTime
	const getEventStyle = (event: any) => {
		const start = new Date(event.start.dateTime)
		const end = new Date(event.end.dateTime)
		const startMinutes = start.getHours() * 60 + start.getMinutes()
		const duration = (end.getTime() - start.getTime()) / 60000

		return {
			top: `${(startMinutes / 60) * hourHeight + 2}px`,
			right: '38px',
			left: '10px',
			height: `${Math.max((duration / 60) * hourHeight - 4, 42)}px`,
		}
	}

	return (
		<div
			onClick={() => onEventClick(event)}
			className={`absolute z-20 px-3 py-2 overflow-hidden transition-all border-r-2 rounded-xl shadow-sm
                ${hasAction ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : 'cursor-default'}
                ${isNow ? 'bg-primary/15 border-primary backdrop-blur-md ring-1 ring-primary/30' : 'bg-base-300/90 hover:bg-base-300 border-primary/40'}
                ${isEnd && 'opacity-60! border-r!'}
            `}
			style={getEventStyle(event)}
		>
			<div className="flex flex-col h-full gap-1">
				<div className="flex items-start justify-between gap-2">
					<h4
						className={`font-medium text-[11px] leading-tight line-clamp-2 ${isNow ? 'text-primary' : 'text-muted'}`}
					>
						{event.summary}
					</h4>
					{!isShort && event.hangoutLink && (
						<div className="flex items-center gap-1 bg-primary/50 text-[8px] px-1.5 py-0.5 rounded-full font-bold">
							<HiOutlineVideoCamera size={10} />
							<span>میت</span>
						</div>
					)}
				</div>

				<div className="flex items-center gap-2 mt-auto">
					<div className="flex items-center gap-1 opacity-70">
						<span className="text-[9px] font-medium tracking-tighter">
							{start.toLocaleTimeString('fa-IR', {
								hour: '2-digit',
								minute: '2-digit',
							})}{' '}
							{' - '}{' '}
							{end.toLocaleTimeString('fa-IR', {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</span>
					</div>
					{event.location && !isShort && (
						<div className="flex items-center gap-1 opacity-60">
							<HiOutlineMapPin size={10} />
							<span className="text-[9px] truncate max-w-15">
								{event.location}
							</span>
						</div>
					)}
				</div>

				{!isShort && event.attendees && (
					<div className="flex items-center mt-0.5">
						<div className="flex -space-x-1.5 rtl:space-x-reverse">
							{event.attendees
								.slice(0, 3)
								.map((attendee: any, idx: number) => (
									<Tooltip
										key={`attendee-${idx}`}
										content={attendee.email}
										position="top"
									>
										<div className="w-4 h-4 rounded-full bg-base-300 flex items-center justify-center text-[5px] font-bold text-base-content/50 border border-primary/30">
											{getInitials(attendee.email)}
										</div>
									</Tooltip>
								))}
							{event.attendees.length > 3 && (
								<div className="w-5 h-5 rounded-full border-2 border-base-100 bg-base-100 flex items-center justify-center text-[7px] font-bold text-muted text-center">
									+{event.attendees.length - 3}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
