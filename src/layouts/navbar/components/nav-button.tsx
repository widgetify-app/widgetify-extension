import type { JSX } from 'react'

interface NavButtonProps {
	onClick: () => void
	icon: JSX.Element
	id: string
	badge?: JSX.Element | null
	isActive?: boolean
}
export const NavButton = ({
	onClick,
	icon,
	id,
	badge = null,
	isActive = false,
}: NavButtonProps) => (
	<div
		className={`relative flex justify-center items-center h-8 px-1 transition-all duration-300 cursor-pointer w-8 rounded-full hover:opacity-80 group ${isActive ? 'hover:bg-primary/10' : ''}`}
		onClick={onClick}
		id={id}
	>
		{icon}
		{badge}
	</div>
)
