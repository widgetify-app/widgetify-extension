import { useAuth } from '@/context/auth.context'
import { useEffect, useState } from 'react'
import { WidgetContainer } from '../widgets/widget-container'
import { NotificationCenter } from './notification-center/notification-center'
import { Pet } from './pets/pet'
import { PetProvider } from './pets/pet.context'

export const WidgetifyLayout = () => {
	const { user, isAuthenticated } = useAuth()

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

				<div className="relative z-10 flex flex-col items-center gap-1 overflow-y-auto h-60 small-scrollbar">
					<div
						className={
							'flex items-center w-full pb-1 border-b border-content'
						}
					>
						<div className="flex items-center gap-2">
							<p className="w-32 text-sm font-semibold truncate">
								سلام {userName || '👋'}
							</p>
						</div>
					</div>

					{/* Daily Summary Content */}
					<div className="flex-1 w-full pt-1.5 overflow-y-auto small-scrollbar">
						<NotificationCenter />
					</div>
				</div>
			</div>
		</WidgetContainer>
	)
}
