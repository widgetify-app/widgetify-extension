import { useEffect, useState } from 'react'
import { useGeneralSetting } from '../../context/general-setting.context'
import ClockComponent from './components/clock.component'
import { DogComponent } from './components/pet-dog.component'

export const WidgetifyLayout = () => {
	const { enablePets } = useGeneralSetting()
	const random = ['گوجه', 'هندونه 🍉', 'بلبل جان', 'باهوش 🧠']
	const [userName, setUserName] = useState<string>('')
	// Set the random name only once when component mounts
	useEffect(() => {
		setUserName(random[Math.floor(Math.random() * random.length)])
	}, []) // Empty dependency array ensures this runs only once

	return (
		<div className="h-full p-3 bg-neutral-900/70 backdrop-blur-sm rounded-2xl max-h-80">
			<div className="relative w-full h-full">
				{enablePets && <DogComponent />}

				<div className="relative z-10 flex flex-col items-center gap-2">
					<div className="flex items-center justify-between w-full border-b border-gray-700/30">
						<p className="font-semibold text-gray-300 truncate text-md">
							سلام {userName}، چه خبر؟
						</p>
						<ClockComponent />
					</div>
				</div>
			</div>
		</div>
	)
}
