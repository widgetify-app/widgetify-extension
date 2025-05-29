import Tooltip from '@/components/toolTip'
import { getBookmarkStyle, getContainerBackground } from '@/context/theme.context'
import { CiBookmarkPlus } from 'react-icons/ci'

export function EmptyBookmarkSlot({
	onClick,
	theme = 'glass',
	canAdd,
}: { onClick: (e?: React.MouseEvent<any>) => void; theme?: string; canAdd: boolean }) {
	const getEmptySlotStyle = () => {
		if (!canAdd) {
			return `opacity-30 ${getContainerBackground(theme)} ${getBookmarkStyle(theme)} cursor-default`
		}

		switch (theme) {
			case 'light':
				return `${getBookmarkStyle(theme)} ${getContainerBackground(theme)} border-blue-300/40 hover:border-blue-400/70 hover:bg-blue-50/50`
			case 'dark':
				return `${getBookmarkStyle(theme)} ${getContainerBackground(theme)} border-blue-500/20 hover:border-blue-400/40 hover:bg-blue-900/20`
			default: // glass
				return `${getBookmarkStyle(theme)} ${getContainerBackground(theme)}	 border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-900/10`
		}
	}

	return (
		<Tooltip content="افزودن بوکمارک">
			<button
				onClick={canAdd ? onClick : undefined}
				className={`relative flex flex-col items-center justify-center p-4 transition-all duration-300 border cursor-pointer group rounded-xl w-[5.4rem] h-[5.7rem] ${getEmptySlotStyle()} ${canAdd ? 'transition-transform ease-in-out group-hover:scale-102' : ''}`}
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
						className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t ${theme === 'light' ? 'from-black/5' : 'from-white/5'} to-transparent rounded-xl`}
					/>
				)}
			</button>
		</Tooltip>
	)
}
