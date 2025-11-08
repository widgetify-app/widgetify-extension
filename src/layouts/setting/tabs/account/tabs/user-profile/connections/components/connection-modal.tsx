import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import type { Platform } from './platform-config.js'

interface ConnectionModalProps {
	platform: Platform | null
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	isLoading: boolean
}

export function ConnectionModal({
	platform,
	isOpen,
	onClose,
	onConfirm,
	isLoading,
}: ConnectionModalProps) {
	if (!platform) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`مدیریت پلتفرم‌های متصل`}
			direction="rtl"
		>
			<div className="p-4">
				<div className="flex items-center gap-3 mb-4">
					<div
						className={`flex items-center justify-center w-10 h-10 ${platform.bgColor} rounded-lg`}
					>
						{platform.icon}
					</div>
					<h2 className="text-xl font-semibold text-content">
						{platform.connected ? 'قطع اتصال از' : 'اتصال به'} {platform.name}
					</h2>
				</div>

				<div className="mb-6">
					{platform.connected ? (
						<div className="space-y-2">
							<p className="text-content">
								آیا مطمئن هستید که می‌خواهید اتصال به {platform.name} را
								قطع کنید؟
							</p>
							<div className="p-3 text-sm rounded-2xl text-warning-content bg-warning/80">
								⚠️ با قطع اتصال، دسترسی به داده‌ها و ویژگی‌های مربوط به این
								پلتفرم از دست خواهد رفت.
							</div>
						</div>
					) : (
						<div className="space-y-3">
							<p className="text-content">{platform.description}</p>
							{platform.features && platform.features.length > 0 && (
								<div>
									<p className="mb-2 text-sm font-medium text-content">
										امکانات:
									</p>
									<ul className="space-y-1">
										{platform.features.map(
											(feature: string, index: number) => (
												<li
													key={index}
													className="flex items-center gap-2 text-sm text-muted"
												>
													<span className="w-1.5 h-1.5 bg-primary rounded-full" />
													{feature}
												</li>
											)
										)}
									</ul>
								</div>
							)}
							{platform.permissions && platform.permissions.length > 0 && (
								<div>
									<p className="mb-2 text-sm font-medium text-content">
										مجوزهای مورد نیاز:
									</p>
									<ul className="space-y-1">
										{platform.permissions.map(
											(permission: string, index: number) => (
												<li
													key={index}
													className="flex items-center gap-2 text-sm text-muted"
												>
													<span className="w-1.5 h-1.5 bg-secondary rounded-full" />
													{permission}
												</li>
											)
										)}
									</ul>
								</div>
							)}
						</div>
					)}
				</div>

				<div className="flex justify-end gap-3">
					<Button
						size="sm"
						onClick={onClose}
						disabled={isLoading}
						className="w-32 rounded-2xl bg-base-300 text-content hover:bg-base-300/90"
					>
						لغو
					</Button>
					<Button
						size="sm"
						onClick={() => (isLoading ? undefined : onConfirm())}
						className={`w-32 rounded-2xl ${isLoading && '!cursor-not-allowed'} ${
							platform.connected
								? 'bg-error/20 text-error border-error/30 hover:bg-error/25'
								: 'btn-primary text-white'
						}`}
					>
						{isLoading ? (
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 border-2 border-current rounded-full animate-spin border-t-transparent" />
								در حال پردازش...
							</div>
						) : platform.connected ? (
							'قطع اتصال'
						) : (
							'ادامه'
						)}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
