import { useCurrencyStore } from '@/context/currency.context'
import { getButtonStyles, useTheme } from '@/context/theme.context'
import { useEffect, useState } from 'react'
import { FiDollarSign } from 'react-icons/fi'
import { WidgetContainer } from '../widget-container'
import { SelectCurrencyModal } from './components/addCurrency-box'
import { ArzHeader } from './components/arz-header'
import { CurrencyBox } from './components/currency-box'

interface WigiArzLayoutProps {
	enableHeader?: boolean
	enableBackground?: boolean
	showSettingsModal?: boolean
	onSettingsModalClose?: () => void
	inComboWidget: boolean
}

export function WigiArzLayout({
	enableHeader = true,
	enableBackground = true,
	showSettingsModal = false,
	onSettingsModalClose,
	inComboWidget,
}: WigiArzLayoutProps) {
	const { selectedCurrencies } = useCurrencyStore()

	const { theme } = useTheme()
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		if (showSettingsModal) {
			setShowModal(true)
		}
	}, [showSettingsModal])

	const handleModalClose = (show: boolean) => {
		setShowModal(show)
		if (!show && onSettingsModalClose) {
			onSettingsModalClose()
		}
	}

	return (
		<>
			<WidgetContainer background={enableBackground} className={'flex flex-col gap-1'}>
				{enableHeader ? (
					<ArzHeader title="ویجی‌ ارز" onSettingsClick={() => handleModalClose(true)} />
				) : null}

				{selectedCurrencies.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center">
						<FiDollarSign className="w-12 h-12 mb-3 opacity-30" />
						<p className="text-sm opacity-50">ارزهای مورد نظر خود را اضافه کنید</p>
						<button
							className={`mt-3 px-4 py-1.5 cursor-pointer rounded-lg ${getButtonStyles(theme)}`}
							onClick={() => handleModalClose(true)}
						>
							افزودن ارز
						</button>
					</div>
				) : (
					<div
						className={`flex flex-col gap-1 ${inComboWidget ? '' : 'overflow-y-auto'}`}
						style={{
							scrollbarWidth: 'none',
						}}
					>
						{selectedCurrencies.map((currency, index) => (
							<div key={`${currency}-${index}`}>
								<CurrencyBox code={currency} key={`${currency}-${index}`} />
							</div>
						))}
					</div>
				)}
			</WidgetContainer>

			<SelectCurrencyModal show={showModal} setShow={handleModalClose} />
		</>
	)
}
