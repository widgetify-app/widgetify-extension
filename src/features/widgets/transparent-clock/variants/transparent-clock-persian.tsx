import type React from 'react'
import { t } from '@/common/i18n'
import { TransparentClockFace } from '../components/transparent-clock-face'
import type { TransparentClockStyle } from '../types'

interface TransparentClockPersianProps {
	time: Date
	hours: string
	minutes: string
	isoDateTime: string
	clockStyle: TransparentClockStyle
}

export const TransparentClockPersian: React.FC<TransparentClockPersianProps> = ({
	time,
	hours,
	minutes,
	isoDateTime,
	clockStyle,
}) => {
	return (
		<TransparentClockFace
			hours={hours}
			minutes={minutes}
			weekday={time.toLocaleDateString('fa-IR', { weekday: 'long' })}
			date={time.toLocaleDateString('fa-IR', { day: 'numeric', month: 'long' })}
			readableTime={t('widgets.transparentClock.readable', {
				hours,
				minutes,
			})}
			isoDateTime={isoDateTime}
			clockStyle={clockStyle}
			dateColor="primary"
			className="pr-3"
		/>
	)
}
