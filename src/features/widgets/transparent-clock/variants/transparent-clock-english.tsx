import type React from 'react'
import { t } from '@/common/i18n'
import { TransparentClockFace } from '../components/transparent-clock-face'
import type { TransparentClockStyle } from '../types'

interface TransparentClockEnglishProps {
	time: Date
	hours: string
	minutes: string
	isoDateTime: string
	clockStyle: TransparentClockStyle
}

export const TransparentClockEnglish: React.FC<TransparentClockEnglishProps> = ({
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
			weekday={time.toLocaleDateString('en-US', { weekday: 'long' })}
			date={time.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
			readableTime={t('widgets.transparentClock.readable', {
				hours,
				minutes,
			})}
			isoDateTime={isoDateTime}
			clockStyle={clockStyle}
			dateColor="secondary"
			className="pr-2 font-latin"
			metaStyle={{ letterSpacing: '0.02em' }}
			metaDir="ltr"
		/>
	)
}
