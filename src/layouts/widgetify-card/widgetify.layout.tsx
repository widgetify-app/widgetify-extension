import { useAuth } from '@/context/auth.context'
import {
	getBorderColor,
	getWidgetItemBackground,
	useTheme,
} from '@/context/theme.context'
import { useGetDailyMessage } from '@/services/hooks/getDailyMessage.hook'
import { useEffect, useState } from 'react'
import { FiMessageCircle } from 'react-icons/fi'
import { WidgetContainer } from '../widgets/widget-container'
import ClockComponent from './components/clock.component'
import { GoogleOverviewCard } from './overviewCards/google.overviewCard'
import { TodoOverviewCard } from './overviewCards/todo-overviewCard'
import { Pet } from './pets/pet'
import { PetProvider } from './pets/pet.context'

export const WidgetifyLayout = () => {
	const { theme } = useTheme()
	const { user, isAuthenticated } = useAuth()

	const [userName, setUserName] = useState<string>('')

	const { data: dailyMessage } = useGetDailyMessage()

	useEffect(() => {
		if (isAuthenticated && user && user.name) {
			setUserName(user.name)
		}
	}, [isAuthenticated, user])

	return (
		<WidgetContainer className="widgetify-layout overflow-hidden">
			<div className="relative w-full h-full">
				{
					<PetProvider>
						<Pet />
					</PetProvider>
				}

				<div className="relative z-10 flex flex-col items-center h-64 gap-1 overflow-y-auto small-scrollbar">
					<div
						className={`flex items-center justify-between w-full border-b ${getBorderColor(theme)}`}
					>
						<div className="flex items-center gap-2">
							<p className="w-32 text-xs font-semibold truncate">سلام {userName}! </p>
						</div>
						<ClockComponent />
					</div>

					{/* Daily Summary Content */}
					<div className="flex-1 w-full py-2 overflow-y-auto small-scrollbar">
						{dailyMessage?.content && (
							<div
								className={`p-2 mb-1 rounded-lg ${getWidgetItemBackground(theme)} shadow-sm border-r-2 border-blue-400/50`}
							>
								<div className="flex items-start gap-2">
									{dailyMessage.isAi && (
										<FiMessageCircle className="mt-0.5 text-blue-400 flex-shrink-0" />
									)}
									<div className="flex-1">
										<div
											className="text-xs font-light leading-relaxed"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
											dangerouslySetInnerHTML={{ __html: dailyMessage.content }}
										/>
									</div>
								</div>
							</div>
						)}

						<div className="space-y-1">
							<GoogleOverviewCard />
							<TodoOverviewCard />
						</div>
					</div>
				</div>
			</div>
		</WidgetContainer>
	)
}
