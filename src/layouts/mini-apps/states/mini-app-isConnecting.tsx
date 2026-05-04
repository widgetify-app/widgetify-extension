import { IconLoading } from '@/components/loading/icon-loading'

interface Prop {
	icon?: string
	name?: string
}

export function MiniAppIsConnecting({ icon, name }: Prop) {
	return (
		<div className="absolute inset-0 z-10 flex items-center justify-center p-6">
			<div className="flex flex-col items-center w-full max-w-xs gap-5 p-6 text-center">
				<div className="flex items-center justify-center w-16 h-16 p-2 rounded-xl bg-primary/10">
					{icon ? (
						<img
							src={icon}
							alt={name || 'App Icon'}
							className="object-cover w-full h-full rounded-lg"
						/>
					) : (
						<div className="w-full h-full rounded-lg bg-muted/20"></div>
					)}
				</div>

				<div className="flex items-center justify-center ml-3">
					<IconLoading className="ml-1!" />
					<span className="text-sm text-content">در حال اتصال...</span>
				</div>
			</div>
		</div>
	)
}
