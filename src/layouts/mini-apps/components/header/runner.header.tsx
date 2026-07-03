import { callEvent } from '@/common/utils/call-event'
import type { MiniApp } from '@/services/hooks/mini-apps/mini-apps-interface'
import { Icon } from '@/src/icons'

interface Prop {
	onClickToBack: any
	isLoadingApp: boolean
	app?: MiniApp
	handleReload: any
	isConnecting: boolean
	isLoading: boolean
}
export function MiniAppRunnerHeader({
	app,
	handleReload,
	isLoading,
	isConnecting,
	isLoadingApp,
	onClickToBack,
}: Prop) {
	const [isFullScreen, setIsFullScreen] = useState(false)
	const onToggleFullScreen = () => {
		const newState = !isFullScreen
		setIsFullScreen(newState)
		callEvent('toggle_miniApp_fullScreen', newState)
	}
	return (
		<div className="sticky top-0 z-10 w-full border-b border-base-content/5">
			<div className="relative flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-2">
					<button
						className="flex items-center justify-center w-8 h-8 transition-all duration-200 border rounded-lg cursor-pointer bg-base-200/50 active:scale-95 group border-base-content/5"
						aria-label="بازگشت"
						onClick={() => onClickToBack()}
					>
						<Icon
							name="chevronRight"
							size={20}
							className="transition-colors duration-200 text-base-content/60 group-hover:text-base-content"
						/>
					</button>

					<div className="flex items-center gap-2.5">
						{!isLoadingApp && app?.icon && (
							<img
								src={app.icon}
								alt={app.name}
								className="object-cover rounded-lg w-7 h-7 shrink-0"
							/>
						)}
						{isLoadingApp && (
							<div className="rounded-lg w-7 h-7 skeleton bg-base-content/10 shrink-0" />
						)}

						<div>
							{isLoadingApp ? (
								<div className="w-24 h-3.5 rounded-full skeleton bg-base-content/10" />
							) : (
								<h2 className="text-base font-bold leading-tight text-content">
									{app?.name ?? ''}
								</h2>
							)}
							{app?.description && (
								<p className="text-xs leading-tight text-base-content/50">
									{app.description}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="flex gap-1">
					<button
						onClick={() => onToggleFullScreen()}
						disabled={isLoading || isConnecting}
						className="flex items-center justify-center w-8 h-8 transition-all duration-200 border rounded-lg cursor-pointer bg-base-200/50 active:scale-95 group border-base-content/5 disabled:opacity-40"
					>
						{isFullScreen ? (
							<Icon
								name="minimize"
								size={18}
								className={`transition-colors duration-200 text-base-content/60 group-hover:text-base-content`}
							/>
						) : (
							<Icon
								name="maximize"
								size={18}
								className={`transition-colors duration-200 text-base-content/60 group-hover:text-base-content`}
							/>
						)}
					</button>

					<button
						onClick={handleReload}
						className="flex items-center justify-center w-8 h-8 transition-all duration-200 border rounded-lg cursor-pointer bg-base-200/50 active:scale-95 group border-base-content/5 disabled:opacity-40"
					>
						<Icon
							name="reload"
							size={18}
							className={`transition-colors duration-200 text-base-content/60 group-hover:text-base-content ${isLoading || isConnecting ? 'animate-spin' : ''}`}
						/>
					</button>
				</div>
			</div>
		</div>
	)
}
