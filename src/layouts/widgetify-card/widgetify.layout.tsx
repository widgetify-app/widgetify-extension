import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useTheme } from '@/context/theme.context'
import { useEffect, useState } from 'react'
import ClockComponent from './components/clock.component'
import { DogComponent } from './components/pet-dog.component'

export const WidgetifyLayout = () => {
	const { enablePets } = useGeneralSetting()
	const { themeUtils } = useTheme()
	const { user, isAuthenticated } = useAuth()
	const random = ['گوجه', 'هندونه 🍉', 'بلبل جان', 'باهوش 🧠']
	const [userName, setUserName] = useState<string>('')

	useEffect(() => {
		if (isAuthenticated && user && user.name) {
			setUserName(user.name)
		} else {
			setUserName(random[Math.floor(Math.random() * random.length)])
		}
	}, [isAuthenticated, user, random])

	return (
		<div
			className={`h-full p-3 ${themeUtils.getCardBackground()} rounded-2xl xl:max-h-96 h-80 w-full overflow-hidden`}
		>
			<div className="relative w-full h-full">
				{enablePets && <DogComponent />}

				<div className="relative z-10 flex flex-col items-center gap-2">
					<div
						className={`flex items-center justify-between w-full border-b ${themeUtils.getBorderColor()}`}
					>
						<div className="flex items-center gap-2">
							<p className="w-32 font-semibold truncate text-md">سلام {userName}! </p>
						</div>
						<ClockComponent />
					</div>
				</div>
			</div>
		</div>
	)
}
