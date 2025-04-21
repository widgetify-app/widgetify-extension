import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { BookmarkTooltip } from './bookmark/bookmark-title'
import { getBookmarkStyle } from './shared'

export function EmptyBookmarkSlot({
	onClick,
	theme = 'glass',
	canAdd,
}: { onClick: (e?: React.MouseEvent<any>) => void; theme?: string; canAdd: boolean }) {
	const [isHovered, setIsHovered] = useState(false)

	const getEmptySlotStyle = () => {
		if (!canAdd) {
			return `opacity-30 ${getBookmarkStyle(theme)} cursor-default`
		}

		switch (theme) {
			case 'light':
				return `${getBookmarkStyle(theme)} border-blue-300/40 hover:border-blue-400/70 hover:bg-blue-50/50`
			case 'dark':
				return `${getBookmarkStyle(theme)} border-blue-500/20 hover:border-blue-400/40 hover:bg-blue-900/20`
			default: // glass
				return `${getBookmarkStyle(theme)} border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-900/10`
		}
	}

	return (
		<motion.button
			onClick={canAdd ? onClick : undefined}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={canAdd ? { scale: 1.02 } : { scale: 1 }}
			transition={{ type: 'spring', stiffness: 400, damping: 17 }}
			className={`relative flex flex-col items-center justify-center p-4 transition-all duration-300 border cursor-pointer group rounded-xl w-[5.4rem] h-[5.7rem] ${getEmptySlotStyle()}`}
		>
			<div className="relative flex items-center justify-center opacity-60 w-14 h-14">
				{canAdd ? (
					<div className="flex items-center justify-center ">
						<FaPlus />
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

			{canAdd && isHovered && <BookmarkTooltip title="افزودن بوکمارک" theme={theme} />}
		</motion.button>
	)
}
