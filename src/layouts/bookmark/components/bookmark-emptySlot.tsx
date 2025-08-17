import { CiBookmarkPlus } from 'react-icons/ci'
import Tooltip from '@/components/toolTip'

export function EmptyBookmarkSlot({
	onClick,
	canAdd,
}: {
	onClick: (e?: React.MouseEvent<any>) => void
	theme?: string
	canAdd: boolean
}) {
	const getBookmarkStyle = () => {
		return 'bg-widget hover:!bg-base-300 text-content backdrop-blur-sm border-content'
	}

	const getEmptySlotStyle = () => {
		if (!canAdd) {
			return `opacity-30 bg-content ${getBookmarkStyle()} cursor-default`
		}

		return getBookmarkStyle()
	}

	return (
		<Tooltip content="افزودن بوکمارک" className="w-full lg:min-w-[5.4rem]">
			<button
				onClick={canAdd ? onClick : undefined}
				className={`relative flex flex-col items-center shadow-sm justify-center p-4 transition-all duration-300 border cursor-pointer group rounded-2xl w-full h-20 md:h-[5.5rem] ${getEmptySlotStyle()} ${canAdd ? 'transition-transform ease-in-out group-hover:scale-102' : ''}`}
			>
				<div className="relative flex items-center justify-center opacity-60 w-14 h-14">
					{canAdd ? (
						<div className="flex items-center justify-center ">
							<CiBookmarkPlus size={24} />
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
		</Tooltip>
	)
}
