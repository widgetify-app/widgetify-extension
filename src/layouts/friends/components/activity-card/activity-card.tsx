import { AvatarComponent } from '@/components/avatar.component'

interface ActivityCardProps {
	avatar: string
	name: string
	activity: string
	onClick?: () => void
}

export const ActivityCard = ({ avatar, name, activity, onClick }: ActivityCardProps) => {
	return (
		<button
			onClick={onClick}
			className="flex flex-col items-center shrink-0 group"
			type="button"
		>
			<div className="relative flex flex-col items-center">
				<div className="relative w-24 h-16">
					<div
						className={`
							w-full h-full text-[10px] px-2 py-1 rounded-2xl 
							leading-tight text-center overflow-hidden transition-all
							bg-content shadow-md text-base-content/80
							${onClick ? 'group-hover:scale-95 cursor-pointer z-10' : ''}
						`}
					>
						<div className="flex items-center justify-center w-full h-full overflow-y-auto wrap-break-word scrollbar-none text-shadow-2xs">
							{activity}
						</div>
					</div>

					<div className="absolute w-2 h-2 -translate-x-3 rounded-full -bottom-0.5 left-7 bg-base-300/40  z-10" />
					<div className="absolute w-2 h-2 -translate-x-3 rounded-full  -bottom-3.5 left-8 bg-base-300/40 shadow-md  z-10" />
					<div className="absolute z-10 w-2 h-2 -translate-x-3 rounded-full shadow-md bg-base-300 -bottom-6 left-10" />
				</div>

				<div className="-mt-1">
					<div
						className={`
							rounded-full transition-all ring-2 ring-base-300
							${onClick ? '' : ''}
						`}
					>
						<AvatarComponent
							url={avatar}
							placeholder={name}
							size="sm"
							className="object-cover w-12 h-12 rounded-full"
						/>
					</div>
				</div>
			</div>

			<p className="w-full px-1 mt-2 text-xs font-medium text-center truncate text-content">
				{name}
			</p>
		</button>
	)
}
