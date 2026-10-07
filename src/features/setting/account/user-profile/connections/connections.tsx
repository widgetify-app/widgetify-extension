import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { connectPlatform, disconnectPlatform } from '@/services/user/platform-connections'
import { useGetUserProfile } from '@/services/user/user-service.hook'
import { ConnectionModal } from './components/connection-modal'
import type { Platform } from './components/platform-config'
import { PLATFORM_CONFIGS } from './components/platform-data'
import { showToast } from '@/common/toast'
import { Spinner } from '@/components/ui'

export function Connections() {
	const { data: profile } = useGetUserProfile()

	const [platforms, setPlatforms] = useState<Platform[]>([])
	const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		const initialPlatforms = PLATFORM_CONFIGS.map((config) => ({
			...config,
			connected: false,
			isLoading: false,
		}))
		setPlatforms(initialPlatforms)
	}, [])

	useEffect(() => {
		if (profile?.connections) {
			setPlatforms((prevPlatforms) =>
				prevPlatforms.map((platform) => ({
					...platform,
					connected: profile.connections.includes(platform.id),
				}))
			)
		}
	}, [profile?.connections])

	const handleConnectionClick = (platformId: string) => {
		if (!profile?.verified) {
			return showToast('اول حسابت رو تایید کن', 'error')
		}

		const platform = platforms.find((p) => p.id === platformId)
		if (!platform) {
			return showToast('این پلتفرم فعلاً غیرفعاله', 'error')
		}

		if (!platform.isActive && !platform.connected) {
			return showToast('این پلتفرم هنوز آماده نیست', 'error')
		}

		setSelectedPlatform(platform)
		setIsModalOpen(true)
		Analytics.event(
			`connection_${platform.id}_${platform.connected ? 'disconnect' : 'connect'}_modal`
		)
	}

	const handleConnectionConfirm = async () => {
		if (!selectedPlatform) return

		setSelectedPlatform((prev) => (prev ? { ...prev, isLoading: true } : prev))

		try {
			if (selectedPlatform.connected) {
				await disconnectPlatform(selectedPlatform.id)

				setPlatforms((prev) =>
					prev.map((p) =>
						p.id === selectedPlatform.id
							? { ...p, connected: false, isLoading: false }
							: p
					)
				)

				showToast(`اتصال به ${selectedPlatform.name} قطع شد`, 'success')
			} else {
				const { url } = await connectPlatform(selectedPlatform.id)

				window.location.href = url
			}
		} catch {
			setPlatforms((prev) =>
				prev.map((p) =>
					p.id === selectedPlatform.id ? { ...p, isLoading: false } : p
				)
			)

			showToast(
				`نتونستیم به ${selectedPlatform.name} وصل بشیم، دوباره امتحان کن`,
				'error'
			)
		}

		setIsModalOpen(false)
		setSelectedPlatform(null)
	}

	const handleModalClose = () => {
		setIsModalOpen(false)
		setSelectedPlatform(null)
	}

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 gap-2 mt-3 sm:grid-cols-2">
				{platforms.map((platform) => (
					<button
						type="button"
						disabled={!platform.isActive && !platform.connected}
						key={platform.id}
						onClick={() =>
							(platform.isActive || platform.connected) &&
							handleConnectionClick(platform.id)
						}
						className={`group relative w-full text-start p-2.5 rounded-2xl border transition-ui duration-200 bg-surface-2 border-surface-3
                ${
					platform.connected ? '' : ' hover:bg-fill'
				} ${!platform.isActive && !platform.connected ? 'opacity-50' : 'cursor-pointer active:scale-95'}`}
					>
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-2.5 overflow-hidden">
								<div
									className={`flex items-center justify-center w-9 h-9 shrink-0 rounded-lg ${platform.bgColor} text-white`}
								>
									{platform.icon}
								</div>
								<div className="overflow-hidden">
									<h3 className="text-sm font-bold text-fg truncate">
										{platform.name}
									</h3>
									<p
										className={`text-3xs  font-medium truncate ${platform.connected ? 'text-success' : 'text-fg-muted'}`}
									>
										{platform.connected ? 'وصله' : 'وصل نیست'}
									</p>
								</div>
							</div>

							<div
								className={`h-7 px-3 flex items-center justify-center rounded-lg text-3xs font-black shrink-0 transition-ui
                    ${
						platform.connected
							? 'bg-danger-fill text-danger'
							: 'bg-brand text-on-brand'
					} ${!platform.isActive && !platform.connected ? 'bg-surface-3! text-fg-muted' : ''}`}
							>
								{platform.isLoading ? (
									<Spinner size="xs" tone="current" />
								) : platform.connected ? (
									'قطع'
								) : (
									'اتصال'
								)}
							</div>
						</div>
					</button>
				))}
			</div>

			<ConnectionModal
				platform={selectedPlatform}
				isOpen={isModalOpen}
				onClose={handleModalClose}
				onConfirm={handleConnectionConfirm}
				isLoading={selectedPlatform?.isLoading || false}
			/>
		</div>
	)
}
