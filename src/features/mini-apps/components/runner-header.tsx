import { callEvent } from '@/common/utils/call-event'
import type { MiniApp } from '@/services/mini-apps/mini-apps.interface'
import { Icon } from '@/icons'
import { Button, PopoverMenu, PopoverMenuItem, Tooltip, VipBadge } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import Analytics from '@/analytics'

interface Prop {
	onClickToBack: () => void
	onOpenInWindow?: () => void
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
	onOpenInWindow,
}: Prop) {
	const [isFullScreen, setIsFullScreen] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)
	const menuAnchorRef = useRef<HTMLButtonElement>(null)
	const { isVip } = useAuth()

	const onToggleFullScreen = () => {
		const newState = !isFullScreen
		setIsFullScreen(newState)
		callEvent('toggle_miniApp_fullScreen', newState)
		Analytics.event('mini_app_fullscreen')
	}

	const fullScreenLabel = isFullScreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'
	return (
		<div className="sticky top-0 z-10 w-full border-b border-line">
			<div className="relative flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-2">
					<Button
						type="button"
						size={'md'}
						className="bg-fill-2 px-3! py-0!"
						color={'base'}
						aria-label="بازگشت"
						onClick={onClickToBack}
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
					<Tooltip content="بارگذاری دوباره">
						<Button
							type="button"
							size={'md'}
							className="bg-fill-2"
							color={'base'}
							aria-label="بارگذاری دوباره"
							onClick={handleReload}
						>
							<Icon
								name="refresh"
								size={16}
								className="transition-colors duration-200 text-fg-muted group-hover:text-fg-strong"
								spin={isLoading || isConnecting}
							/>
						</Button>
					</Tooltip>

					<Button
						ref={menuAnchorRef}
						type="button"
						size={'md'}
						color={'base'}
						className="bg-fill-2"
						aria-label="گزینه‌های بیشتر"
						aria-expanded={menuOpen}
						onClick={() => setMenuOpen((open) => !open)}
					>
						<Icon
							name="menuOption"
							size={16}
							className="transition-colors duration-200 text-fg-muted group-hover:text-fg-strong"
						/>
					</Button>

					<PopoverMenu
						isOpen={menuOpen}
						onClose={() => setMenuOpen(false)}
						triggerRef={menuAnchorRef}
						placement="bottom-end"
						width={200}
					>
						<PopoverMenuItem
							icon={
								<Icon
									name={isFullScreen ? 'minimize' : 'maximize'}
									size={14}
								/>
							}
							label={fullScreenLabel}
							disabled={isLoading || isConnecting}
							onClick={() => {
								setMenuOpen(false)
								onToggleFullScreen()
							}}
						/>
						{onOpenInWindow && (
							<PopoverMenuItem
								icon={<Icon name="pictureInPicture" size={14} />}
								label="باز کردن تو پنجره جدا"
								badge={isVip ? undefined : <VipBadge size="xs" />}
								disabled={isVip && (isLoading || isConnecting)}
								onClick={() => {
									setMenuOpen(false)
									if (isVip) onOpenInWindow()
									else {
										Analytics.event('mini_app_pro_gate_blocked')
										callEvent('openSettings', 'vip')
									}
								}}
							/>
						)}
					</PopoverMenu>
				</div>
			</div>
		</div>
	)
}
