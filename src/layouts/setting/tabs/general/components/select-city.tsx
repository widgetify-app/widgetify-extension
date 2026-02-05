import { useState, useMemo } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import Analytics from '@/analytics'
import { IconLoading } from '@/components/loading/icon-loading'
import Modal from '@/components/modal'
import { SectionPanel } from '@/components/section-panel'
import { useGetCitiesList } from '@/services/hooks/cities/getCitiesList'
import { useAuth } from '@/context/auth.context'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import { useSetCity } from '@/services/hooks/user/userService.hook'
import { TextInput } from '@/components/text-input'
import { showToast } from '@/common/toast'
import { translateError } from '@/utils/translate-error'

interface SelectedCity {
	city: string
	cityId: string
}

export function SelectCity() {
	const [searchTerm, setSearchTerm] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [showAuthModal, setShowAuthModal] = useState(false)
	const searchInputRef = useRef<HTMLInputElement>(null)
	const { isAuthenticated, user, isLoadingUser } = useAuth()
	const { data: cities, isLoading, error } = useGetCitiesList(isAuthenticated)
	const { mutateAsync: setCityToServer, isPending: isSettingCity } = useSetCity()

	const filteredCities = useMemo(() => {
		if (!cities || !searchTerm) return cities || []

		const lowerSearchTerm = searchTerm.toLowerCase()

		const prefixMatches = cities.filter((city) =>
			city.city.toLowerCase().startsWith(lowerSearchTerm)
		)

		const remainingCities = cities.filter(
			(city) =>
				!city.city.toLowerCase().startsWith(lowerSearchTerm) &&
				city.city.toLowerCase().includes(lowerSearchTerm)
		)

		return [...prefixMatches, ...remainingCities]
	}, [cities, searchTerm])

	const handleSelectCity = async (city: SelectedCity) => {
		if (!city.cityId) return
		try {
			setIsModalOpen(false)
			setSearchTerm('')

			Analytics.event('city_selected')

			await setCityToServer(city.cityId)
		} catch (error) {
			showToast(translateError(error) as any, 'error')
		}
	}

	const onModalOpen = () => {
		if (!isAuthenticated) {
			Analytics.event('open_city_selection_modal_unauthenticated')
			setShowAuthModal(true)
			return
		}

		setIsModalOpen(true)
		Analytics.event('open_city_selection_modal')
		setTimeout(() => {
			searchInputRef.current?.focus()
		}, 300)
	}

	const selected = user?.city
		? filteredCities.find((c) => c.cityId === user.city?.id)
		: null

	return (
		<SectionPanel title="انتخاب شهر" size="sm">
			<div className="space-y-2">
				<button
					onClick={onModalOpen}
					disabled={isSettingCity}
					className="flex items-center justify-between w-full p-3 text-right transition-colors border cursor-pointer rounded-2xl bg-base-100 border-base-300 hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoadingUser ? (
						<IconLoading className="mx-auto text-center" />
					) : selected ? (
						selected.city
					) : (
						'انتخاب شهر...'
					)}
					{isSettingCity ? (
						<IconLoading />
					) : (
						<CiLocationOn className="w-5 h-5 text-primary" />
					)}
				</button>

				{error && (
					<div className="p-3 text-sm text-right duration-300 border rounded-lg border-error/20 bg-error/10 backdrop-blur-sm animate-in fade-in-0">
						<div className="font-medium text-error">
							خطا در دریافت اطلاعات
						</div>
						<div className="mt-1 text-error/80">
							لطفا اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید.
						</div>
					</div>
				)}
			</div>
			{showAuthModal && (
				<AuthRequiredModal
					isOpen={showAuthModal}
					onClose={() => setShowAuthModal(!showAuthModal)}
					message="برای انتخاب شهر، لطفاً وارد حساب کاربری خود شوید."
				/>
			)}
			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false)
					setSearchTerm('')
				}}
				title="انتخاب شهر"
				size="lg"
				direction="rtl"
			>
				<div className="space-y-2 overflow-hidden">
					<div className="relative">
						<TextInput
							type="text"
							placeholder="جستجوی شهر..."
							value={searchTerm}
							ref={searchInputRef}
							onChange={(value) => setSearchTerm(value)}
						/>
						<CiLocationOn className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-base-content/40" />
					</div>

					<div className="overflow-y-auto min-h-52 max-h-52 custom-scrollbar">
						{isLoading ? (
							<div className="flex items-center justify-center p-4 text-center text-primary">
								<IconLoading />
								در حال بارگذاری...
							</div>
						) : filteredCities?.length > 0 ? (
							filteredCities.map((city) => (
								<div
									key={city.cityId}
									onClick={() => handleSelectCity(city)}
									className="flex items-center w-full p-3 text-right transition-all duration-200 border-b cursor-pointer border-base-200/30 last:border-b-0 group rounded-2xl hover:bg-primary/20 hover:text-primary"
								>
									<CiLocationOn className="flex-shrink-0 w-5 h-5 ml-3 transition-transform text-primary group-hover:scale-110" />
									<span className="flex-1 font-medium">
										{city.city}
									</span>
								</div>
							))
						) : searchTerm ? (
							<div className="p-4 text-center text-base-content/60">
								نتیجه‌ای یافت نشد
							</div>
						) : cities && cities.length === 0 ? (
							<div className="p-4 text-center text-base-content/60">
								هیچ شهری موجود نیست
							</div>
						) : (
							<div className="p-4 text-center text-base-content/60">
								شهر مورد نظر خود را جستجو کنید
							</div>
						)}
					</div>

					<div className="pt-2 border-t border-base-300">
						<p className="text-sm text-center text-base-content/60">
							شهر شما در لیست نیست یا مشکلی مشاهده می‌کنید؟{' '}
							<a
								href="https://feedback.widgetify.ir"
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium text-primary hover:underline"
								onClick={() =>
									Analytics.event('feedback_link_clicked', {
										source: 'city_selection',
									})
								}
							>
								اطلاع دهید
							</a>
						</p>
					</div>
				</div>
			</Modal>
		</SectionPanel>
	)
}
