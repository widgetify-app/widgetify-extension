import { Button, Modal, Spinner } from '@/components/ui'
import type { Platform } from './platform-config'

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
		<Modal isOpen={isOpen} onClose={onClose} title={`مدیریت پلتفرم‌های متصل`}>
			<div className="p-4">
				<div className="flex items-center gap-3 mb-4">
					<div
						className={`flex items-center justify-center w-10 h-10 ${platform.bgColor} rounded-lg`}
					>
						{platform.icon}
					</div>
					<h2 className="text-xl font-semibold text-fg">
						{platform.connected ? 'قطع اتصال از' : 'اتصال به'} {platform.name}
					</h2>
				</div>

				<div className="mb-6">
					{platform.connected ? (
						<div className="space-y-2">
							<p className="text-fg">اتصال به {platform.name} قطع بشه؟</p>
							<div className="p-3 text-sm rounded-2xl text-on-warning bg-warning">
								⚠️ با قطع اتصال، دیگه به داده‌ها و امکانات این پلتفرم دسترسی
								نداری.
							</div>
						</div>
					) : (
						<div className="space-y-3">
							<p className="text-fg">{platform.description}</p>
							{platform.features && platform.features.length > 0 && (
								<div>
									<p className="mb-2 text-sm font-medium text-fg">
										امکانات:
									</p>
									<ul className="space-y-1">
										{platform.features.map(
											(feature: string, index: number) => (
												<li
													key={index}
													className="flex items-center gap-2 text-sm text-fg-muted"
												>
													<span className="w-1.5 h-1.5 bg-brand rounded-full" />
													{feature}
												</li>
											)
										)}
									</ul>
								</div>
							)}
							{platform.permissions && platform.permissions.length > 0 && (
								<div>
									<p className="mb-2 text-sm font-medium text-fg">
										مجوزهای مورد نیاز:
									</p>
									<ul className="space-y-1">
										{platform.permissions.map(
											(permission: string, index: number) => (
												<li
													key={index}
													className="flex items-center gap-2 text-sm text-fg-muted"
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
						onClick={() => (isLoading ? undefined : onConfirm())}
						loading={isLoading}
						loadingText={
							<span className="flex items-center justify-center gap-2">
								<Spinner size="sm" tone="image" />
								یه لحظه…
							</span>
						}
						className="flex-2 h-9 text-sm"
						rounded={'2xl'}
						color={platform.connected ? 'danger' : 'brand'}
					>
						{platform.connected ? 'قطع اتصال' : 'تایید و شروع اتصال'}
					</Button>
					<Button
						size="sm"
						onClick={onClose}
						disabled={isLoading}
						rounded={'2xl'}
						className="flex-1 h-9"
					>
						لغو
					</Button>
				</div>
			</div>
		</Modal>
	)
}
