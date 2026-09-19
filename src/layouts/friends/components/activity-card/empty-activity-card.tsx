import { AvatarComponent } from '@/components/ui'
import { Icon } from '@/icons'

interface EmptyActivityCardProps {
	avatar: string
	name: string
	onClick: () => void
}

export const EmptyActivityCard = ({ avatar, name, onClick }: EmptyActivityCardProps) => {
	return (
		<button
			onClick={onClick}
			className="flex flex-col items-center transition-all duration-150 cursor-pointer shrink-0 group active:scale-95"
			type="button"
		>
			<div className="relative flex flex-col items-center">
				<div className="relative w-24 h-16">
					<div className="relative w-24 h-16">
						<div
							className={`
							w-full h-full text-[10px] px-2 py-1 rounded-2xl 
							leading-tight text-center overflow-hidden transition-all
							bg-content border border-subtle shadow-xs text-muted
							group-hover:scale-95 cursor-pointer z-10
						`}
						>
							<div className="flex items-center justify-center w-full h-full overflow-y-auto wrap-break-word scrollbar-none">
								<Icon name="penAI" className="w-5 h-5" />
							</div>
						</div>

						<div className="absolute w-2 h-2 -translate-x-3 rounded-full -bottom-0.5 left-7 bg-raised-subtle  z-10" />
						<div className="absolute w-2 h-2 -translate-x-3 rounded-full  -bottom-3.5 left-8 bg-raised-subtle shadow-md  z-10" />
						<div className="absolute z-10 w-2 h-2 -translate-x-3 rounded-full shadow-md bg-raised -bottom-6 left-10" />
					</div>
					<div className="absolute w-2 h-2 -translate-x-3 rounded-full -bottom-0.5 left-7 bg-raised-subtle " />
					<div className="absolute w-2 h-2 -translate-x-3 rounded-full  -bottom-3.5 left-8 bg-raised-subtle shadow-md " />
					<div className="absolute w-2 h-2 -translate-x-3 rounded-full shadow-md bg-raised -bottom-6 left-10" />
				</div>

				{/* Avatar */}
				<div className="-mt-1">
					<div className="transition-all rounded-full ring-2 ring-content">
						<AvatarComponent
							url={avatar}
							placeholder={name}
							size="sm"
							className="object-cover w-12 h-12 rounded-full"
						/>
					</div>
				</div>
			</div>

			{/* Name */}
			<p className="w-full px-1 mt-2 text-xs font-medium text-center truncate text-content">
				{name}
			</p>
		</button>
	)
}
