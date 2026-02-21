import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth.context'
import { WidgetContainer } from '../widgets/widget-container'
import { NotificationCenter } from './notification-center/notification-center'
import { Pet } from './pets/pet'
import { PetProvider } from './pets/pet.context'
import { BlurModeButton } from '@/components/blur-mode/blur-mode.button'

export const WidgetifyLayout = () => {
	const { user, isAuthenticated, isLoadingUser } = useAuth()

	const [userName, setUserName] = useState<string>('')

	useEffect(() => {
		if (isAuthenticated && !isLoadingUser) {
			if (user?.name) setUserName(user.name)
		}
	}, [isAuthenticated, user])

	return (
		<WidgetContainer className="overflow-hidden !h-72 !min-h-72 !max-h-72">
			<div className="relative w-full h-full">
				{
					<PetProvider>
						<Pet />
					</PetProvider>
				}

				<div className="relative z-10 flex flex-col items-center gap-2 overflow-y-auto h-60 small-scrollbar">
					<div className={'flex items-center w-full justify-between'}>
						<div className="flex items-center gap-2">
							<p className="w-32 text-xs font-semibold truncate">
								سلام {userName || '👋'}
							</p>
						</div>

						<BlurModeButton />
					</div>

					<div
						className={`flex flex-col flex-1 w-full gap-1 overflow-y-auto small-scrollbar`}
					>
						<NotificationCenter />
					</div>
				</div>
			</div>
		</WidgetContainer>
	)
}
