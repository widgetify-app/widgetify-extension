import type React from 'react'
import { TransparentClockFace } from '../components/transparent-clock-face'

interface TransparentClockEnglishProps {
	time: Date
	hours: string
	minutes: string
	isoDateTime: string
}

export const TransparentClockEnglish: React.FC<TransparentClockEnglishProps> = ({
	time,
	hours,
	minutes,
	isoDateTime,
}) => {
	return (
		<TransparentClockFace
			hours={hours}
			minutes={minutes}
			weekday={time.toLocaleDateString('en-US', { weekday: 'long' })}
			date={time.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
			readableTime={`ساعت ${hours}:${minutes}`}
			isoDateTime={isoDateTime}
			dateColor="secondary"
			className="pr-2 font-latin"
			metaStyle={{ letterSpacing: '0.02em' }}
		/>
	)
}
