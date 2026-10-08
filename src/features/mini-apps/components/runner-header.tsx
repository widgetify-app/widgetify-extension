import { callEvent } from '@/common/utils/call-event'
import type { MiniApp } from '@/services/mini-apps/mini-apps.interface'
import { Icon } from '@/icons'
import { Button } from '@/components/ui'

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
		<div className="sticky top-0 z-10 w-full border-b border-line">
			<div className="relative flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-2">
					<Button
						type="button"
						size={'md'}
						className="bg-fill-2/80 px-3! py-0!"
						color={'base'}
						aria-label="بازگشت"
						onClick={() => onClickToBack()}
					>
						<Icon
							name="chevronRight"
							size={16}
							className="transition-colors duration-200 text-fg-muted group-hover:text-fg-strong"
						/>
					</Button>

					<div className="flex items-center gap-2.5">
						{!isLoadingApp && app?.icon && (
							<img
								src={app.icon}
								alt={app.name}
								className="object-cover rounded-lg w-7 h-7 shrink-0"
							/>
						)}
						{isLoadingApp && (
							<div className="rounded-lg w-7 h-7 skeleton bg-fill-2 shrink-0" />
						)}

						<div>
							{isLoadingApp ? (
								<div className="w-24 h-3.5 rounded-full skeleton bg-fill-2" />
							) : (
								<h2 className="text-base font-bold leading-tight text-fg">
									{app?.name ?? ''}
								</h2>
							)}
							{app?.description && (
								<p className="text-xs leading-tight text-fg-faint">
									{app.description}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="flex gap-1">
					<Button
						type="button"
						size={'md'}
						color={'base'}
						className="bg-fill-2/80"
						onClick={() => onToggleFullScreen()}
						disabled={isLoading || isConnecting}
					>
						{isFullScreen ? (
							<Icon
								name="minimize"
								size={16}
								className={`transition-colors duration-200 text-fg-muted group-hover:text-fg-strong`}
							/>
						) : (
							<Icon
								name="maximize"
								size={16}
								className={`transition-colors duration-200 text-fg-muted group-hover:text-fg-strong`}
							/>
						)}
					</Button>

					<Button
						type="button"
						size={'md'}
						className="bg-fill-2/80"
						color={'base'}
						onClick={handleReload}
					>
						<Icon
							name="refresh"
							size={16}
							className="transition-colors duration-200 text-fg-muted group-hover:text-fg-strong"
							spin={isLoading || isConnecting}
						/>
					</Button>
				</div>
			</div>
		</div>
	)
}
