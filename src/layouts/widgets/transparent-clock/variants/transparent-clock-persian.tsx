import type React from 'react'
import { TransparentClockFace } from '../components/transparent-clock-face'

interface TransparentClockPersianProps {
	time: Date
	hours: string
	minutes: string
	isoDateTime: string
}

export const TransparentClockPersian: React.FC<TransparentClockPersianProps> = ({
	time,
	hours,
	minutes,
	isoDateTime,
}) => {
	return (
		<TransparentClockFace
			hours={hours}
			minutes={minutes}
			weekday={time.toLocaleDateString('fa-IR', { weekday: 'long' })}
			date={time.toLocaleDateString('fa-IR', { day: 'numeric', month: 'long' })}
			readableTime={`ساعت ${hours}:${minutes}`}
			isoDateTime={isoDateTime}
			dateColor="primary"
			className="pr-3"
		/>
	)
}
