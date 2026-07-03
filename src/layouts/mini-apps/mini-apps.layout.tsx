import { useGetMiniApps } from '@/services/hooks/mini-apps/get-mini-apps.hook'
import { MiniAppCard } from './components/card/mini-app-card'
import { MiniAppCardSkeleton } from './components/card/mini-app-card-skeleton'
import { useEffect, useRef } from 'react'
import { MiniAppRunner } from './mini-app-runner'
import { listenEvent } from '@/common/utils/call-event'
import Analytics from '@/analytics'
import Modal from '@/components/modal'
import { Button } from '@/components/button/button'
import { Icon } from '@/src/icons'
const EmptyMiniAppImage = 'https://cdn.widgetify.ir/extension/empty-mini-app.png'
export function MiniAppsLayout() {
	const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, isError } =
		useGetMiniApps({ limit: 10 })
	const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
	const miniApps = data?.pages?.flatMap((f) => f.data.miniApps) ?? []
	const isEmpty = !isLoading && !isError && miniApps.length === 0
	const [isFullScreen, setIsFullScreen] = useState(false)
	const [showInfo, setShowInfo] = useState(false)

	const onClickToExist = () => {
		setSelectedAppId(null)
		if (isFullScreen) setIsFullScreen(false)
		Analytics.event('mini_app_exist')
	}
	const observerRef = useRef<IntersectionObserver | null>(null)
	const loadMoreRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const event = listenEvent('toggle_miniApp_fullScreen', (newState) => {
			setIsFullScreen(newState)
		})

		return () => {
			event()
		}
	}, [])

	const onClickToShowInfo = () => {
		Analytics.event('mini_apps_show_info_modal')
		setShowInfo(true)
	}

	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		observerRef.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage()
				}
			},
			{ threshold: 0.1 }
		)

		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current)
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect()
			}
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	return (
		<div className="w-full h-[calc(100vh-4rem)] overflow-hidden">
			<div className="flex flex-row justify-between w-full h-full px-4 py-2 overflow-hidden">
				<div
					className={`flex-1 w-full h-full p-1 border-l border-content bg-content bg-glass rounded-tr-2xl rounded-br-2xl ${isFullScreen ? 'hidden' : ''} transition-all duration-200`}
				>
					<div className="flex justify-between px-1 py-2">
						<p className="text-lg font-bold"> برنامک ها</p>
						<div
							onClick={() => onClickToShowInfo()}
							className="p-1 text-lg font-bold cursor-pointer text-base-content/80 hover:text-base-content active:scale-95"
						>
							<Icon name="info" className="m-auto text-center" />
						</div>
					</div>
					<div className="flex flex-col gap-1 mt-4 overflow-y-auto  h-[calc(100vh-10rem)]">
						{isEmpty && (
							<div className="flex flex-col items-center justify-center gap-3 py-16 text-center rounded-2xl bg-content">
								<div className="text-5xl">📭</div>
								<p className="text-base font-medium text-content">
									هنوز برنامکی وجود ندارد
								</p>
								<p className="text-sm text-muted">به زودی پر میشه...</p>
							</div>
						)}
						{miniApps.map((app) => (
							<div key={app.appId}>
								<MiniAppCard
									app={app}
									onLaunch={() => setSelectedAppId(app.appId)}
									isSelected={selectedAppId === app.appId}
								/>
							</div>
						))}

						{hasNextPage && (
							<div
								ref={loadMoreRef}
								className="flex flex-col gap-1 mt-1 shrink-0"
							>
								{isFetchingNextPage &&
									[...Array(5)].map((_, i) => (
										<MiniAppCardSkeleton key={i} />
									))}
							</div>
						)}
					</div>
				</div>
				<div
					className={`flex items-center justify-center w-full h-full rounded-tr-none rounded-br-none bg-content bg-glass flex-3 rounded-2xl text-content rounded-bl-2xl ${isFullScreen ? 'rounded-2xl!' : ''}`}
				>
					{selectedAppId ? (
						<MiniAppRunner
							appId={selectedAppId}
							onClickToExist={() => onClickToExist()}
							isFullScreen={isFullScreen}
						/>
					) : (
						<div className="flex flex-col items-center text-center">
							<img
								src={EmptyMiniAppImage}
								className="max-h-80 max-w-80"
								onError={(e) => {
									// @ts-ignore
									e.target?.remove()
								}}
							/>
							<p className="text-lg font-bold text-content">
								یه برنامک انتخاب کن
							</p>
						</div>
					)}
				</div>
			</div>

			{showInfo && (
				<Modal
					title="برنامک ها"
					isOpen
					onClose={() => setShowInfo(false)}
					direction="rtl"
				>
					<div className="space-y-3 text-sm">
						<p className="font-semibold">
							برنامک‌ها برنامه‌های کوچیکی هستن که تو ویجتیفای اجرا می‌شن و راحت
							می‌تونی ازشون استفاده کنی، بدون اینکه مجبور باشی از اپ اصلی بری
							بیرون.
						</p>

						<p>
							خیالت راحت! این برنامک‌ها به طور پیش‌فرض به هیچ اطلاعاتی ازت
							دسترسی ندارن و فقط و فقط با اجازه خودت می‌تونن به اطلاعاتت
							دسترسی پیدا کنن.
						</p>

						<p>
							اگر علاقه‌مند به همکاری با ما در این حوزه هستید، راه‌های ارتباطی
							در دسترس شماست.
						</p>
					</div>

					<Button
						size="sm"
						type="button"
						isPrimary
						onClick={() => setShowInfo(false)}
						className="h-12 mt-2 text-base font-bold shadow-sm btn-block rounded-2xl"
					>
						باشه
					</Button>
				</Modal>
			)}
		</div>
	)
}
