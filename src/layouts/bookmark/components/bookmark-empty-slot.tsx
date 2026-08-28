import { cn } from '@/common/utils/cn'
import { Icon } from '@/src/icons'

export function EmptyBookmarkSlot({
	onClick,
	canAdd,
}: {
	onClick: (e?: React.MouseEvent<any>) => void
	theme?: string
	canAdd: boolean
}) {
	return (
		<button
			onClick={canAdd ? onClick : undefined}
			className={cn(
				'relative flex flex-col items-center shadow-xs h-full w-full justify-center p-2 duration-300 border cursor-pointer border-content bg-content bg-glass group rounded-widget transition-transform ease-in-out group-hover:scale-102'
			)}
		>
			<div className="relative flex items-center justify-center w-full h-full">
				{canAdd ? (
					<div className="flex items-center justify-center">
						<Icon name="bookmarkPlus" size={32} className="opacity-50" />
					</div>
				) : (
					<div className="flex items-center justify-center w-6 h-6 rounded-full bg-base-content/20" />
				)}
			</div>

			{canAdd && (
				<div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-base-content/5 rounded-widget pointer-events-none" />
			)}
		</button>
	)
}
