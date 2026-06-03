import { getContrastingTextColor } from '@/common/color'
import { NewBadge } from '@/components/badges/new.badge'
import type { MiniApp } from '@/services/hooks/mini-apps/mini-apps-interface'

interface MiniAppCardProps {
	app: MiniApp
	onLaunch: (app: MiniApp) => void
	isSelected: boolean
}

export function MiniAppCard({ app, onLaunch, isSelected }: MiniAppCardProps) {
	return (
		<div
			onClick={() => onLaunch(app)}
			className={`
                group relative flex items-center gap-3 p-2 rounded-2xl cursor-pointer
                transition-all duration-200 active:scale-[0.98] select-none overflow-hidden
                border ${
					isSelected
						? `border-primary/30 bg-linear-to-t from-primary/10 via-primary/5 to-transparent shadow-md shadow-primary/10`
						: `border-base-content/5 bg-content bg-glass! hover:bg-primary/5 hover:border-primary/10`
				}
            `}
		>
			<div
				className={`
                    absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full
                    transition-all duration-200
                    ${isSelected ? 'bg-primary opacity-100' : 'opacity-0'}
                `}
			/>

			<div
				className={`
                    z-10 flex items-center justify-center w-8 h-8 overflow-hidden rounded-xl shrink-0
                    transition-transform duration-200
                    ${isSelected ? 'scale-105' : 'group-hover:scale-105'}
                `}
			>
				{app.icon ? (
					<img
						src={app.icon}
						alt={app.name}
						className="object-cover w-full h-full"
					/>
				) : (
					<span className="text-2xl">📦</span>
				)}
			</div>

			<div className="z-10 flex-1 min-w-0">
				<p
					className={`
                        text-sm font-semibold truncate transition-colors
                        ${isSelected ? 'text-primary' : 'text-base-content'}
                    `}
				>
					{app.name}
				</p>

				{app.description && (
					<p className="text-xs min-w-60 max-w-60 mt-0.5 text-base-content/70 ">
						{app.description}
					</p>
				)}
			</div>

			{app.badge && (
				<div
					className={`
                        absolute px-2 py-0.5 text-xs left-0 w-32 text-center top-0 rounded-br-2xl
                        transform transition-all duration-200 shadow-xl
                        ${app.badgeAnimate ? 'animate-bounce' : ''}
                        ${isSelected ? 'opacity-100' : 'opacity-90'}
                    `}
					style={{
						backgroundColor: app.badgeColor || '#536dfe',
						color: getContrastingTextColor(app.badgeColor || '#536dfe'),
					}}
				>
					<div className="relative z-10 font-normal tracking-wide">
						{app.badge}
					</div>
				</div>
			)}

			{app.isNew ? <NewBadge className="bottom-1 right-8" /> : null}
		</div>
	)
}
