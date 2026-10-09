import { AvatarComponent } from '@/components/ui'
import { t } from '@/common/i18n'
import { ActivityBubble } from './activity-bubble'

interface EmptyActivityCardProps {
	avatar: string
	name: string
	onClick: () => void
}

export const EmptyActivityCard = ({ avatar, name, onClick }: EmptyActivityCardProps) => {
	return (
		<button
			onClick={onClick}
			className="flex flex-col items-center justify-end pt-4 transition-ui duration-150 cursor-pointer shrink-0 group active:scale-95"
			type="button"
		>
			<div className="relative flex flex-col items-center">
				<ActivityBubble isInteractive>
					<p className="text-fg-faint">{t('friends.activity.emptyPrompt')}</p>
				</ActivityBubble>

				{/* Avatar */}
				<div className="-mt-3">
					<div className="transition-ui rounded-full ring-2 ring-surface-3">
						<AvatarComponent
							url={avatar}
							placeholder={name}
							size="sm"
							className="object-cover w-16 h-16 rounded-full"
						/>
					</div>
				</div>
			</div>

			{/* Name */}
			<p className="w-full px-1 mt-2 text-xs font-medium text-center truncate text-fg">
				{name}
			</p>
		</button>
	)
}
