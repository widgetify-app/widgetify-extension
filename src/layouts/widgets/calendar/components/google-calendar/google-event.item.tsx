import Tooltip from '@/components/toolTip'
import { HiOutlineMapPin, HiOutlineVideoCamera } from 'react-icons/hi2'

interface CalendarEventProps {
	event: any
	isNow: boolean
	isPast: boolean
	isNext: boolean
	currentTime: Date
	getInitials: (email: string) => string
	onEventClick: (event: any) => void
}

export const CalendarEvent = ({
	event,
	isNow,
	isPast,
	isNext,
	currentTime,
	getInitials,
	onEventClick,
}: CalendarEventProps) => {
	const start = new Date(event.start.dateTime)
	const end = new Date(event.end.dateTime)
	const hasAction = !!(event.hangoutLink || event.location)
	const minsLeft = Math.ceil((end.getTime() - currentTime.getTime()) / 60000)

	const timeStr = (d: Date) =>
		d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })

	if (isNow) {
		return (
			<div
				onClick={() => hasAction && onEventClick(event)}
				className={`relative flex items-center gap-0 px-1 py-1 rounded-xl transition-colors shrink-0 ${hasAction ? 'cursor-pointer hover:bg-primary/8 active:scale-[0.98]' : 'cursor-default'}`}
			>
				<div className="flex flex-col items-end justify-center shrink-0 w-[40px] gap-0.5 pl-1">
					<span className="text-[11px] font-bold tabular-nums leading-none text-primary">
						{timeStr(start)}
					</span>
					<span className="text-[9px] tabular-nums leading-none text-primary/50">
						{timeStr(end)}
					</span>
				</div>

				<div className="w-[3px] self-stretch rounded-full mx-2 shrink-0 bg-primary" />

				<div className="flex-1 min-w-0 flex flex-col gap-0.5">
					<div className="flex items-center min-w-0 gap-1">
						<span className="text-[11px] font-bold truncate flex-1 text-base-content">
							{event.summary || 'بدون عنوان'}
						</span>
						{event.hangoutLink ? (
							<button
								onClick={(e) => {
									e.stopPropagation()
									onEventClick(event)
								}}
								className="flex items-center gap-1 px-2 py-0.5 mb-1 rounded-lg bg-primary text-white text-[9px]  cursor-pointer transition-all hover:brightness-110 active:scale-95 shrink-0 font-medium"
							>
								<HiOutlineVideoCamera size={9} />
								ورود به جلسه
							</button>
						) : event.location ? (
							<></>
						) : null}
					</div>

					<div className="flex items-center gap-1.5">
						<span className="relative flex w-1.5 h-1.5 shrink-0">
							<span className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping bg-primary" />
							<span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-primary" />
						</span>
						<span className="text-[9px] font-bold text-primary">
							در حال برگزاری
						</span>
						<span className="text-[9px] text-base-content/40 tabular-nums">
							· {minsLeft} دقیقه مانده
						</span>
					</div>
				</div>

				<div className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-primary/15">
					<div
						className="h-full transition-all duration-1000 bg-primary/50"
						style={{
							width: `${Math.min(100, ((currentTime.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100)}%`,
						}}
					/>
				</div>
			</div>
		)
	}

	return (
		<div
			onClick={() => hasAction && onEventClick(event)}
			className={`flex items-center gap-0 px-1 py-1.5 rounded-xl transition-colors
				${hasAction && !isPast ? 'cursor-pointer hover:bg-base-200/40 active:scale-[0.98]' : 'cursor-default'}
				${isPast ? 'opacity-35' : ''}
			`}
		>
			<div className="flex flex-col items-end justify-center shrink-0 w-[40px] gap-0.5 pl-1">
				<span
					className={`text-[11px] font-bold tabular-nums leading-none ${isNext ? 'text-warning' : 'text-base-content'}`}
				>
					{timeStr(start)}
				</span>
				<span className="text-[9px] tabular-nums leading-none text-base-content/35">
					{timeStr(end)}
				</span>
			</div>

			<div
				className={`w-[3px] self-stretch rounded-full mx-2 shrink-0 ${
					isNext ? 'bg-warning' : 'bg-base-content/10'
				}`}
			/>

			<div className="flex-1 min-w-0 flex flex-col gap-0.5">
				<div className="flex items-center min-w-0 gap-1">
					<span
						className={`text-[11px] font-semibold leading-snug truncate flex-1 ${
							isPast
								? 'line-through text-base-content/40'
								: 'text-base-content'
						}`}
					>
						{event.summary || 'بدون عنوان'}
					</span>
					{event.hangoutLink && (
						<HiOutlineVideoCamera
							size={11}
							className="shrink-0 text-base-content/30"
						/>
					)}
					{!event.hangoutLink && event.location && (
						<HiOutlineMapPin
							size={11}
							className="shrink-0 text-base-content/30"
						/>
					)}
				</div>

				<div className="flex items-center min-w-0 gap-2">
					{isNext && (
						<span className="text-[9px] font-bold text-warning shrink-0">
							بعدی
						</span>
					)}
					{event.location && (
						<span className="text-[9px] text-base-content/35 truncate max-w-[70px]">
							{event.location}
						</span>
					)}
					{event.attendees && event.attendees.length > 0 && (
						<div className="flex items-center gap-1 mr-auto shrink-0">
							<div className="flex -space-x-1 rtl:space-x-reverse">
								{event.attendees.slice(0, 3).map((a: any, i: number) => (
									<Tooltip key={i} content={a.email} position="top">
										<div className="w-3.5 h-3.5 rounded-full bg-base-300 border border-base-content/10 flex items-center justify-center text-[5px] font-bold text-base-content/50">
											{getInitials(a.email)}
										</div>
									</Tooltip>
								))}
							</div>
							{event.attendees.length > 3 && (
								<span className="text-[8px] text-base-content/35">
									+{event.attendees.length - 3}
								</span>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
