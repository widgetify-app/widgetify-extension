import { motion } from 'framer-motion'
import jalaliMoment from 'jalali-moment'
import { useEffect, useState } from 'react'

export const WidgetifyLayout = () => {
	const random = ['گوجه', 'هندونه 🍉', 'بلبل جان', 'باهوش 🧠']

	const [user, setUser] = useState({
		name: random[Math.floor(Math.random() * random.length)],
	})

	useEffect(() => {
		const storedUser = localStorage.getItem('user')
		if (storedUser) {
			setUser(JSON.parse(storedUser))
		}
	}, [])
	return (
		<div className="h-full p-3 bg-neutral-900/70 backdrop-blur-sm rounded-2xl max-h-80">
			<div className="flex flex-col items-center gap-2">
				<div className="flex items-center justify-between w-full border-b border-gray-700/30">
					<p className="font-semibold text-gray-300 truncate text-md">
						سلام {user.name}، چه خبر؟
					</p>
					<Clock />
				</div>
			</div>
		</div>
	)
}

function Clock() {
	const [time, setTime] = useState(jalaliMoment().locale('fa').utc().add(3.5, 'hours'))

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(jalaliMoment().locale('fa').utc().add(3.5, 'hours'))
		}, 1000)
		return () => clearInterval(timer)
	}, [])

	const isDayTime = time.hour() >= 6 && time.hour() < 18
	const bgGradient = isDayTime ? '☀️' : '🌙'

	return (
		<motion.div
			className="p-2"
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="text-xs font-extrabold tracking-wide text-white drop-shadow-lg">
				{bgGradient} {time.format('HH:mm')}
			</div>
		</motion.div>
	)
}
