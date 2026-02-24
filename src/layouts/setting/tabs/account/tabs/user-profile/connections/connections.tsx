import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getMainClient } from '@/services/api'
import { useGetUserProfile } from '@/services/hooks/user/userService.hook'
import { ConnectionModal } from './components/connection-modal'
import type { Platform } from './components/platform-config.js'
import { PLATFORM_CONFIGS } from './components/platform-data'
import { showToast } from '@/common/toast'

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
			return showToast('لطفا اول حساب کاربری خود را تأیید کنید.', 'error')
		}

		const platform = platforms.find((p) => p.id === platformId)
		if (!platform) {
			return showToast('این پلتفرم در حال حاضر غیرفعال است.', 'error')
		}

		if (!platform.isActive && !platform.connected) {
			return showToast('این پلتفرم هنوز آماده نیست.', 'error')
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
				const api = await getMainClient()
				await api.post(`/${selectedPlatform.id}/disconnect`)

				setPlatforms((prev) =>
					prev.map((p) =>
						p.id === selectedPlatform.id
							? { ...p, connected: false, isLoading: false }
							: p
					)
				)

				showToast(`اتصال به ${selectedPlatform.name} قطع شد.`, 'success')
			} else {
				const api = await getMainClient()
				const response = await api.post(`/${selectedPlatform.id}/connect`)

				window.location.href = response.data.url
			}
		} catch {
			setPlatforms((prev) =>
				prev.map((p) =>
					p.id === selectedPlatform.id ? { ...p, isLoading: false } : p
				)
			)

			showToast(
				`خطا در ارتباط با ${selectedPlatform.name}. لطفا دوباره تلاش کنید.`,
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
					<div
						key={platform.id}
						onClick={() =>
							(platform.isActive || platform.connected) &&
							handleConnectionClick(platform.id)
						}
						className={`group relative p-2.5 rounded-2xl border transition-all duration-200 bg-base-200 border-base-300
                ${
					platform.connected ? '' : ' hover:bg-base-200/40'
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
									<h3 className="text-[13px] font-bold text-content truncate">
										{platform.name}
									</h3>
									<p
										className={`text-[10px]  font-medium truncate ${platform.connected ? 'text-success' : 'text-muted'}`}
									>
										{platform.connected ? 'متصل شده' : 'عدم اتصال'}
									</p>
								</div>
							</div>

							<div
								className={`h-7 px-3 flex items-center justify-center rounded-lg text-[10px] font-black shrink-0 transition-all
                    ${
						platform.connected
							? 'bg-error/10 text-error'
							: 'bg-primary text-white'
					} ${!platform.isActive && !platform.connected ? 'bg-base-300! text-muted' : ''}`}
							>
								{platform.isLoading ? (
									<div className="w-3 h-3 border-2 border-current rounded-full animate-spin border-t-transparent" />
								) : platform.connected ? (
									'قطع'
								) : (
									'اتصال'
								)}
							</div>
						</div>
					</div>
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
