import type { ReactNode } from 'react'

interface Prop {
	icon?: string
	name?: string
	label: string
	labelIcon: ReactNode
}

export function MiniAppLoadingState({ icon, name, label, labelIcon }: Prop) {
	return (
		<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-6 backdrop-blur-md">
			{icon && (
				<div className="relative w-20 h-20 rounded-3xl shadow-lg p-2.5 border border-primary/20">
					<img
						src={icon}
						alt={name || 'App Icon'}
						className="object-cover w-full h-full rounded-2xl"
					/>
				</div>
			)}
			<div className="flex items-center">
				{labelIcon}
				{label}
			</div>
		</div>
	)
}
