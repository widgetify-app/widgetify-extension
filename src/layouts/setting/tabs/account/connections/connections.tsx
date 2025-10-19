import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { SectionPanel } from '@/components/section-panel'
import { getMainClient } from '@/services/api'
import { useGetUserProfile } from '@/services/hooks/user/userService.hook'
import { ConnectionModal } from './components/connection-modal'
import type { Platform } from './components/platform-config.js'
import { PLATFORM_CONFIGS } from './components/platform-data'

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
			return toast.error('لطفا اول حساب کاربری خود را تأیید کنید.', {
				duration: 4000,
			})
		}

		const platform = platforms.find((p) => p.id === platformId)
		if (!platform) {
			return toast.error('این پلتفرم در حال حاضر غیرفعال است.')
		}

		if (!platform.isActive && !platform.connected) {
			return toast.error('این پلتفرم هنوز آماده نیست.')
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

				toast.success(`اتصال به ${selectedPlatform.name} قطع شد.`)
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

			toast.error(
				`خطا در ارتباط با ${selectedPlatform.name}. لطفا دوباره تلاش کنید.`
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
		<SectionPanel title="پلتفرم‌های متصل" delay={0.4} size="xs">
			<div className="space-y-4">
				<p className={'text-sm font-light text-content'}>
					مدیریت اتصالات پلتفرم‌ها و سرویس‌های متصل به حساب کاربری شما.
				</p>

				<div className="grid grid-cols-1 gap-3 mt-2 sm:grid-cols-2">
					{platforms.map((platform) => (
						<div
							key={platform.id}
							className={`p-3 rounded-lg border border-content cursor-pointer transition-colors hover:bg-base-200/50
                                ${platform.isActive ? '' : 'opacity-50'}
                            `}
							onClick={() => handleConnectionClick(platform.id)}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div
										className={`flex items-center justify-center w-8 h-8 ${platform.bgColor} rounded-md`}
									>
										{platform.icon}
									</div>
									<div>
										<p className={'font-medium text-content'}>
											{platform.name}
										</p>
										<p className="text-xs font-light text-content">
											{platform.connected
												? 'متصل شده'
												: 'متصل نشده'}
										</p>
									</div>
								</div>
								<Button
									onClick={() => handleConnectionClick(platform.id)}
									disabled={
										platform.isLoading ||
										(!platform.isActive && !platform.connected)
									}
									size="xs"
									className={`rounded-2xl w-20 ${platform.connected ? 'btn-error' : 'btn-primary'} text-white/90`}
								>
									{platform.isLoading ? (
										<div className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent" />
									) : !platform.isActive && !platform.connected ? (
										'به زودی ...'
									) : platform.connected ? (
										'قطع اتصال'
									) : (
										'اتصال'
									)}
								</Button>
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
		</SectionPanel>
	)
}
