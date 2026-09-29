import { getContrastingTextColor } from '@/common/utils/color'
import { NewBadge } from '@/components/ui'
import type { MiniApp } from '@/services/mini-apps/mini-apps.interface'

interface MiniAppCardProps {
	app: MiniApp
	onLaunch: (app: MiniApp) => void
	isSelected: boolean
}

export function MiniAppCard({ app, onLaunch, isSelected }: MiniAppCardProps) {
	return (
		<button
			type="button"
			aria-pressed={isSelected}
			onClick={() => onLaunch(app)}
			className={`
                group relative flex items-center w-full gap-3 p-2 text-right rounded-2xl cursor-pointer
                transition-ui duration-200 active:scale-[0.98] select-none overflow-hidden
                border ${
					isSelected
						? `border-brand-fill-2 bg-linear-to-t from-brand-fill via-brand-fill to-transparent shadow-md shadow-brand-fill`
						: `border-line bg-surface-2 hover:bg-brand-fill hover:border-brand-fill`
				}
            `}
		>
			<div
				className={`
                    absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full
                    transition-ui duration-200
                    ${isSelected ? 'bg-brand opacity-100' : 'opacity-0'}
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
                        ${isSelected ? 'text-brand' : 'text-fg-strong'}
                    `}
				>
					{app.name}
				</p>

				{app.description && (
					<p className="text-xs min-w-60 max-w-60 mt-0.5 text-fg-muted ">
						{app.description}
					</p>
				)}
			</div>

			{app.badge && (
				<div
					className={`
                        absolute px-2 py-0.5 text-xs left-0 w-32 text-center top-0 rounded-br-2xl
                        transform transition-ui duration-200 shadow-xl
                        ${app.badgeAnimate ? 'animate-bounce' : ''}
                        ${isSelected ? 'opacity-100' : 'opacity-90'}
                    `}
					style={{
						backgroundColor: app.badgeColor || 'var(--color-primary)',
						color: app.badgeColor
							? getContrastingTextColor(app.badgeColor)
							: 'var(--color-primary-content)',
					}}
				>
					<div className="relative z-10 font-normal tracking-wide">
						{app.badge}
					</div>
				</div>
			)}

			{app.isNew ? <NewBadge className="bottom-1 right-8" /> : null}
		</button>
	)
}
