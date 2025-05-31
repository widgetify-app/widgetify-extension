import { Button } from '@/components/button/button'
import { OfflineIndicator } from '@/components/offline-indicator'
import { SectionPanel } from '@/components/section-panel'
import Tooltip from '@/components/toolTip'
import { getMainClient } from '@/services/api'
import { useGetUserProfile } from '@/services/hooks/user/userService.hook'
import { type JSX, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Platform {
	id: string
	name: string
	icon: JSX.Element
	connected: boolean
	description?: string
	bgColor: string
	isActive: boolean
	isLoading?: boolean
}

export function Connections() {
	const { data: profile } = useGetUserProfile()

	const [platforms, setPlatforms] = useState<Platform[]>([
		{
			id: 'google',
			name: 'گوگل (تقویم و ...)',
			connected: false,
			description: 'اتصال به تقویم گوگل و سایر خدمات',
			bgColor: 'bg-red-500',
			isActive: true,
			isLoading: false,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="white"
				>
					<path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
				</svg>
			),
		},
		{
			id: 'github',
			name: 'گیت‌هاب',
			connected: false,
			bgColor: 'bg-black',
			isActive: false,
			isLoading: false,
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="white"
				>
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
				</svg>
			),
		},
	])

	// Update platform connection status from user profile
	useEffect(() => {
		if (profile?.connections) {
			setPlatforms((prevPlatforms) =>
				prevPlatforms.map((platform) => ({
					...platform,
					connected: profile.connections.includes(platform.id),
				})),
			)
		}
	}, [profile?.connections])

	const handleConnectionToggle = async (platformId: string) => {
		const platformIndex = platforms.findIndex((p) => p.id === platformId)
		const platform = platforms[platformIndex]

		if (platformIndex === -1) {
			return toast.error('این پلتفرم در حال حاضر غیرفعال است.')
		}

		// Set loading state
		setPlatforms(
			platforms.map((p) => (p.id === platformId ? { ...p, isLoading: true } : p)),
		)

		try {
			if (platform.connected) {
				const api = await getMainClient()
				await api.post(`/${platformId}/disconnect`)

				setPlatforms(
					platforms.map((p) =>
						p.id === platformId ? { ...p, connected: false, isLoading: false } : p,
					),
				)

				toast.success(`اتصال به ${platform.name} قطع شد.`)
			} else {
				const api = await getMainClient()
				const response = await api.post(`/${platformId}/connect`)

				window.location.href = response.data.url
			}
		} catch (error) {
			setPlatforms(
				platforms.map((p) => (p.id === platformId ? { ...p, isLoading: false } : p)),
			)

			toast.error(`خطا در ارتباط با ${platform.name}. لطفا دوباره تلاش کنید.`)
			console.error('Connection error:', error)
		}
	}

	const LoadingSpinner = () => (
		<svg
			className="w-4 h-4 animate-spin"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			></circle>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	)

	return (
		<SectionPanel title="پلتفرم‌های متصل" delay={0.4}>
			<div className="space-y-4">
				{profile?.inCache && <OfflineIndicator mode="notification" />}
				<p className={'text-sm font-light text-content'}>
					مدیریت اتصالات پلتفرم‌ها و سرویس‌های متصل به حساب کاربری شما.
				</p>

				<div className="grid grid-cols-1 gap-3 mt-2 sm:grid-cols-2">
					{platforms.map((platform) => (
						<Tooltip
							content={platform.connected ? null : platform.description}
							key={platform.id}
						>
							<div
								className={`p-3 rounded-lg border border-content
                                ${platform.isActive ? '' : 'opacity-50'}
                            `}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div
											className={`flex items-center justify-center w-8 h-8 ${platform.bgColor} rounded-md`}
										>
											{platform.icon}
										</div>
										<div>
											<p className={'font-medium text-content'}>{platform.name}</p>
											<p className="text-xs font-light text-content">
												{platform.connected ? 'متصل شده' : 'متصل نشده'}
											</p>
										</div>
									</div>
									<Button
										onClick={() => handleConnectionToggle(platform.id)}
										disabled={
											platform.isLoading || (!platform.isActive && !platform.connected)
										}
										size="xs"
										className={`${platform.connected ? 'btn-error' : 'btn-primary'} text-white/90`}
									>
										{platform.isLoading ? (
											<LoadingSpinner />
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
						</Tooltip>
					))}
				</div>
			</div>
		</SectionPanel>
	)
}
