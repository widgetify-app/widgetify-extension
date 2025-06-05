import { useGeneralSetting } from '@/context/general-setting.context'
import { getCurrentDate } from '@/layouts/widgets/calendar/utils'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const ClockComponent = () => {
	const { timezone } = useGeneralSetting()
	const [time, setTime] = useState(getCurrentDate(timezone.value))

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(getCurrentDate(timezone.value))
		}, 1000)
		return () => clearInterval(timer)
	}, [timezone])

	const isDayTime = time.hour() >= 6 && time.hour() < 18
	const bgGradient = isDayTime ? '☀️' : '🌙'

	return (
		<motion.div
			className="p-2"
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className={'text-xs font-extrabold tracking-wide text-content drop-shadow-lg'}>
				{bgGradient} {time.format('HH:mm')}
			</div>
		</motion.div>
	)
}

export default ClockComponent
