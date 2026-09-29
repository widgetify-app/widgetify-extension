import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'

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
			type="button"
			onClick={canAdd ? onClick : undefined}
			className={cn(
				'relative flex flex-col items-center h-20 md:h-[5.9rem] w-full justify-center p-2 duration-300 border cursor-pointer border-surface-3 bg-glass-surface-2 group rounded-widget transition-transform ease-in-out group-hover:scale-102'
			)}
		>
			<div className="relative flex items-center justify-center w-full h-full">
				{canAdd ? (
					<div className="flex items-center justify-center">
						<Icon name="bookmarkPlus" size={32} className="opacity-50" />
					</div>
				) : (
					<div className="flex items-center justify-center w-6 h-6 rounded-full bg-fill-3" />
				)}
			</div>

			{canAdd && (
				<div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100 bg-fill rounded-widget" />
			)}
		</button>
	)
}
