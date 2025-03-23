import { useEffect, useState } from 'react'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useTheme } from '@/context/theme.context'
import ClockComponent from './components/clock.component'
import { DogComponent } from './components/pet-dog.component'

export const WidgetifyLayout = () => {
	const { enablePets } = useGeneralSetting()
	const { themeUtils } = useTheme()
	const random = ['گوجه', 'هندونه 🍉', 'بلبل جان', 'باهوش 🧠']
	const [userName, setUserName] = useState<string>('')

	useEffect(() => {
		setUserName(random[Math.floor(Math.random() * random.length)])
	}, [])

	return (
		<div className={`h-full p-3 ${themeUtils.getCardBackground()} rounded-2xl max-h-80 sm:h-64`}>
			<div className="relative w-full h-full">
				{enablePets && <DogComponent />}

				<div className="relative z-10 flex flex-col items-center gap-2">
					<div
						className={`flex items-center justify-between w-full border-b ${themeUtils.getBorderColor()}`}
					>
						<p className="font-semibold truncate text-md">سلام {userName}، چه خبر؟</p>
						<ClockComponent />
					</div>
				</div>
			</div>
		</div>
	)
}
