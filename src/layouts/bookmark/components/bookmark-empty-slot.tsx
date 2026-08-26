import { cn } from '@/common/utils/cn'
import { Icon } from '@/src/icons'

export function EmptyBookmarkSlot({
	onClick,
	canAdd,
	isCustomMode = false,
}: {
	onClick: (e?: React.MouseEvent<any>) => void
	theme?: string
	canAdd: boolean
	isCustomMode?: boolean
}) {
	return (
		<button
			onClick={canAdd ? onClick : undefined}
			className={cn(
				'relative flex flex-col items-center shadow-sm justify-center p-4 duration-300 border cursor-pointer border-content bg-content bg-glass group rounded-widget w-full transition-transform ease-in-out group-hover:scale-102',
				isCustomMode ? 'h-full min-h-0' : 'h-20 md:h-22'
			)}
		>
			<div className="relative flex items-center justify-center w-14 h-14">
				{canAdd ? (
					<div className="flex items-center justify-center ">
						<Icon name="bookmarkPlus" size={38} className="opacity-50" />
					</div>
				) : (
					<div className="flex items-center justify-center w-6 h-6 rounded-full bg-base-content/20"></div>
				)}
			</div>

			{canAdd && (
				<div
					className={
						'absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/5 to-transparent rounded-xl'
					}
				/>
			)}
		</button>
	)
}
