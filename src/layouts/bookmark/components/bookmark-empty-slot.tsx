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
			className={`relative flex bg-content hover:!bg-base-300 text-content  border-content bg-glass flex-col items-center shadow-sm justify-center p-4 transition-all duration-300 border cursor-pointer group rounded-2xl w-full h-20 md:h-[5.5rem] ${canAdd ? 'transition-transform ease-in-out group-hover:scale-102' : 'opacity-30 bg-contentcursor-default'}`}
		>
			<div className="relative flex items-center justify-center w-14 h-14">
				{canAdd ? (
					<div className="flex items-center justify-center ">
						<Icon name="bookmarkPlus" size={38} className="opacity-50" />
					</div>
				) : (
					<div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-500/20"></div>
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
