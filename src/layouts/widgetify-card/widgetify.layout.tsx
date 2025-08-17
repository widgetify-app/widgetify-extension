import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { WidgetContainer } from '../widgets/widget-container'
import { NotificationCenter } from './notification-center/notification-center'
import { GoogleOverviewCard } from './overviewCards/google.overviewCard'
import { TodoOverviewCard } from './overviewCards/todo-overviewCard'
import { Pet } from './pets/pet'
import { PetProvider } from './pets/pet.context'

export const WidgetifyLayout = () => {
	const { user, isAuthenticated } = useAuth()
	const { blurMode, updateSetting } = useGeneralSetting()

	const [userName, setUserName] = useState<string>('')

	useEffect(() => {
		if (isAuthenticated && user && user.name) {
			setUserName(user.name)
		}
	}, [isAuthenticated, user])

	const handleBlurModeToggle = () => {
		const newBlurMode = !blurMode
		updateSetting('blurMode', newBlurMode)
	}

	return (
		<WidgetContainer className="overflow-hidden">
			<div className="relative w-full h-full">
				{
					<PetProvider>
						<Pet />
					</PetProvider>
				}

				<div className="relative z-10 flex flex-col items-center gap-2 overflow-y-auto h-60 small-scrollbar">
					<div className={'flex items-center w-full justify-between'}>
						<div className="flex items-center gap-2">
							<p className="w-32 text-sm font-semibold truncate">
								سلام {userName || '👋'}
							</p>
						</div>
						<Tooltip content={blurMode ? 'نمایش' : 'حالت مخفی'}>
							<div
								className="flex items-center px-1 overflow-hidden transition-all border cursor-pointer border-content rounded-xl bg-content backdrop-blur-sm hover:opacity-80"
								onClick={handleBlurModeToggle}
							>
								{blurMode ? <FaEye /> : <FaEyeSlash />}
							</div>
						</Tooltip>
					</div>

					{/* Daily Summary Content */}
					<div
						className={`flex flex-col flex-1 w-full gap-1 overflow-y-auto small-scrollbar`}
					>
						<div
							className={`flex flex-col gap-1 ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
						>
							<TodoOverviewCard />
							<GoogleOverviewCard />
						</div>
						<NotificationCenter />
					</div>
				</div>
			</div>
		</WidgetContainer>
	)
}
