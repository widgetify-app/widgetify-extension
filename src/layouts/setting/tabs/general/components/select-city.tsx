import { useState, useMemo } from 'react'
import Analytics from '@/analytics'
import { IconLoading } from '@/components/ui'
import { Modal } from '@/components/ui'
import { SectionPanel } from '@/components/ui'
import { useGetCitiesList } from '@/services/hooks/cities/get-cities-list.hook'
import { useAuth } from '@/context/auth.context'
import { AuthRequiredModal } from '@/components/auth/auth-required-modal'
import { useSetCity } from '@/services/hooks/user/user-service.hook'
import { TextInput } from '@/components/ui'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { Icon } from '@/icons'

interface SelectedCity {
	city: string
	cityId: string
}

interface Prop {
	size?: 'lg' | 'xs'
	onSave?: () => void
}
export function SelectCity({ size }: Prop) {
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
		<SectionPanel title="انتخاب شهر" size={size ? size : 'sm'}>
			<div className="space-y-2">
				<button
					onClick={onModalOpen}
					disabled={isSettingCity}
					className="flex items-center justify-between w-full p-3 text-right transition-colors border cursor-pointer rounded-2xl bg-widget border-content hover:bg-content disabled:opacity-50 disabled:cursor-not-allowed"
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
						<Icon name="location" className="w-5 h-5 text-primary" />
					)}
				</button>

				{error && (
					<div className="p-3 text-sm text-right duration-300 border rounded-lg border-danger-muted bg-danger-subtle backdrop-blur-sm animate-in fade-in-0">
						<div className="font-medium text-error">
							خطا در دریافت اطلاعات
						</div>
						<div className="mt-1 text-danger-bold">
							لطفا اتصال اینترنت خود را بررسی کرده و مجددا تلاش کنید.
						</div>
					</div>
				)}
			</div>
			<AuthRequiredModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(!showAuthModal)}
				message="برای انتخاب شهر اول وارد حسابت شو"
			/>
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
						<Icon
							name="location"
							className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-faint"
						/>
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
									className="flex items-center w-full p-3 text-right transition-all duration-200 border-b cursor-pointer border-content-faint last:border-b-0 group rounded-2xl hover:bg-brand-muted hover:text-primary"
								>
									<Icon
										name="location"
										className="flex-shrink-0 w-5 h-5 ml-3 transition-transform text-primary group-hover:scale-110"
									/>
									<span className="flex-1 font-medium">
										{city.city}
									</span>
								</div>
							))
						) : searchTerm ? (
							<div className="p-4 text-center text-muted">
								نتیجه‌ای یافت نشد
							</div>
						) : cities && cities.length === 0 ? (
							<div className="p-4 text-center text-muted">
								هیچ شهری موجود نیست
							</div>
						) : (
							<div className="p-4 text-center text-muted">
								شهر مورد نظر خود را جستجو کنید
							</div>
						)}
					</div>

					<div className="pt-2 border-t border-content">
						<p className="text-sm text-center text-muted">
							اگه شهر شما تو لیست نبود، لطفا اطلاع بدید تا اضافه بشه🤝
						</p>
					</div>
				</div>
			</Modal>
		</SectionPanel>
	)
}
