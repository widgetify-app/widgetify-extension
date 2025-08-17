import { useEffect, useState } from 'react'
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
	const { blurMode } = useGeneralSetting()

	const [userName, setUserName] = useState<string>('')

	useEffect(() => {
		if (isAuthenticated && user && user.name) {
			setUserName(user.name)
		}
	}, [isAuthenticated, user])

	return (
		<WidgetContainer className="overflow-hidden">
			<div className="relative w-full h-full">
				{
					<PetProvider>
						<Pet />
					</PetProvider>
				}

				<div className="relative z-10 flex flex-col items-center gap-2 overflow-y-auto h-60 small-scrollbar">
					<div className={'flex items-center w-full'}>
						<div className="flex items-center gap-2">
							<p className="w-32 text-sm font-semibold truncate">
								سلام {userName || '👋'}
							</p>
						</div>
					</div>

					{/* Daily Summary Content */}
					<div
						className={`flex flex-col flex-1 w-full gap-1 overflow-y-auto small-scrollbar ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
					>
						<TodoOverviewCard />
						<GoogleOverviewCard />
						<NotificationCenter />
					</div>
				</div>
			</div>
		</WidgetContainer>
	)
}
