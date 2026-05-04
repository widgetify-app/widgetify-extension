import type { MiniApp } from '@/services/hooks/mini-apps/mini-apps-interface'

interface MiniAppCardProps {
	app: MiniApp
	onLaunch: (app: MiniApp) => void
}

export function MiniAppCard({ app, onLaunch }: MiniAppCardProps) {
	return (
		<div
			className="flex relative items-center  gap-3 p-2 rounded-2xl bg-content border border-base-content/5 active:scale-[0.98] transition-transform overflow-hidden cursor-pointer bg-glass hover:opacity-70"
			onClick={() => onLaunch(app)}
		>
			<div className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-xl shrink-0">
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

			<div className="flex-1 min-w-0">
				<p className="text-sm font-semibold truncate text-content">{app.name}</p>
				{app.description && (
					<p className="text-xs text-muted truncate mt-0.5">
						{app.description}
					</p>
				)}
			</div>

			{app.badge && (
				<div
					className={`absolute px-2 py-0.5 text-xs transform ${app.badgeAnimate && 'animate-bounce'} transition-all duration-200  shadow-xl left-0 w-32  text-center top-0 rounded-br-2xl`}
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
		</div>
	)
}

function getContrastingTextColor(hex: string) {
	const cleaned = hex.replace('#', '').trim()
	const full =
		cleaned.length === 3
			? cleaned
					.split('')
					.map((c) => c + c)
					.join('')
			: cleaned

	const r = parseInt(full.slice(0, 2), 16)
	const g = parseInt(full.slice(2, 4), 16)
	const b = parseInt(full.slice(4, 6), 16)

	const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

	return luminance > 0.6 ? '#0b0b0f' : '#ffffff'
}
