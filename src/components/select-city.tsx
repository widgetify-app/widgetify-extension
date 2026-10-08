import { useState, useMemo, useRef } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { Alert, Spinner } from '@/components/ui'
import { Modal } from '@/components/ui'
import { SectionPanel } from '@/components/ui'
import { useGetCitiesList } from '@/services/cities/get-cities-list.hook'
import { useAuth } from '@/context/auth.context'
import { AuthRequiredModal } from '@/components/auth/auth-required-modal'
import { useSetCity } from '@/services/user/user-service.hook'
import { TextInput } from '@/components/ui'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { Icon } from '@/icons'

interface SelectedCity {
	city: string
	cityId: string
}

interface Prop {
	size?: 'xs'
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
		<SectionPanel title={t('city.select.title')} size={size ? size : 'sm'}>
			<div className="space-y-2">
				<button
					type="button"
					onClick={onModalOpen}
					disabled={isSettingCity}
					className="flex items-center justify-between w-full p-3 text-right transition-colors border cursor-pointer rounded-2xl bg-surface border-surface-3 hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoadingUser ? (
						<Spinner size="sm" className="mx-auto" />
					) : selected ? (
						selected.city
					) : (
						t('city.select.placeholder')
					)}
					{isSettingCity ? (
						<Spinner size="sm" />
					) : (
						<Icon name="location" className="w-5 h-5 text-brand" />
					)}
				</button>

				{error && (
					<Alert tone="danger" title={t('city.select.loadFailedTitle')}>
						{t('city.select.loadFailedBody')}
					</Alert>
				)}
			</div>
			<AuthRequiredModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(!showAuthModal)}
				message={t('city.select.loginRequired')}
			/>
			<Modal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false)
					setSearchTerm('')
				}}
				title={t('city.select.title')}
				size="lg"
				closeLabel={t('ui.common.close')}
			>
				<div className="space-y-2 overflow-hidden">
					<div className="relative">
						<TextInput
							type="text"
							placeholder={t('city.select.searchPlaceholder')}
							value={searchTerm}
							ref={searchInputRef}
							onChange={(value) => setSearchTerm(value)}
						/>
						<Icon
							name="location"
							className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-fg-faint"
						/>
					</div>

					<div className="overflow-y-auto min-h-52 max-h-52">
						{isLoading ? (
							<div className="flex items-center justify-center p-4 text-center text-brand">
								<Spinner size="sm" aria-hidden="true" />
								{t('city.select.loading')}
							</div>
						) : filteredCities?.length > 0 ? (
							filteredCities.map((city) => (
								<button
									type="button"
									key={city.cityId}
									onClick={() => handleSelectCity(city)}
									className="flex items-center w-full p-3 text-right transition-ui duration-200 border-b cursor-pointer border-surface-3 last:border-b-0 group rounded-2xl hover:bg-brand-fill-2 hover:text-brand"
								>
									<Icon
										name="location"
										className="flex-shrink-0 w-5 h-5 ml-3 transition-transform text-brand group-hover:scale-110"
									/>
									<span className="flex-1 font-medium">
										{city.city}
									</span>
								</button>
							))
						) : searchTerm ? (
							<div className="p-4 text-center text-fg-muted">
								{t('city.select.noMatch')}
							</div>
						) : cities && cities.length === 0 ? (
							<div className="p-4 text-center text-fg-muted">
								{t('city.select.emptyList')}
							</div>
						) : (
							<div className="p-4 text-center text-fg-muted">
								{t('city.select.typeName')}
							</div>
						)}
					</div>

					<div className="pt-2 border-t border-surface-3">
						<p className="text-sm text-center text-fg-muted">
							{t('city.select.missingHint')}
						</p>
					</div>
				</div>
			</Modal>
		</SectionPanel>
	)
}
