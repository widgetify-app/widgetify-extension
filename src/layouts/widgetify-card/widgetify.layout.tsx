import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { WidgetContainer } from '../widgets/widget-container'
import { NotificationCenter } from './notification-center/notification-center'
import { Pet } from './pets/pet'
import { PetProvider } from './pets/pet.context'
import { callEvent } from '@/common/utils/call-event'
import { DailyMoodNotification } from './daily-mood'
export const WidgetifyLayout = () => {
	const { user, isAuthenticated, isLoadingUser } = useAuth()
	const { blurMode, updateSetting } = useGeneralSetting()

	const [userName, setUserName] = useState<string>('')

	useEffect(() => {
		if (isAuthenticated && !isLoadingUser) {
			if (user?.name) setUserName(user.name)
			if (!user?.hasTodayMood && !user?.inCache) {
				callEvent('add_to_notifications', {
					id: 'notificationMood',
					node: <DailyMoodNotification />,
				})
			}
		}
	}, [isAuthenticated, user])

	const handleBlurModeToggle = () => {
		const newBlurMode = !blurMode
		updateSetting('blurMode', newBlurMode)
	}

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
