import { Button } from '@/components/button/button'
import { useCurrencyStore } from '@/context/currency.context'
import { useEffect, useState } from 'react'
import { FiDollarSign } from 'react-icons/fi'
import { WidgetContainer } from '../widget-container'
import { SelectCurrencyModal } from './components/addCurrency-box'
import { ArzHeader } from './components/arz-header'
import { CurrencyBox } from './components/currency-box'

interface WigiArzLayoutProps {
	enableBackground?: boolean
	showSettingsModal?: boolean
	onSettingsModalClose?: () => void
	inComboWidget: boolean
}

export function WigiArzLayout({
	enableBackground = true,
	showSettingsModal = false,
	onSettingsModalClose,
	inComboWidget,
}: WigiArzLayoutProps) {
	const { selectedCurrencies, currencyColorMode } = useCurrencyStore()
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
			{inComboWidget ? (
				<div className="flex items-center justify-between pb-2">
					{selectedCurrencies.length === 0 ? (
						<div
							className={
								'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-16'
							}
						>
							<div
								className={
									'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
								}
							>
								<FiDollarSign className="text-content" size={24} />
							</div>
							<p className="mt-1 text-center text-content">
								ارزهای مورد نظر خود را اضافه کنید
							</p>
							<Button
								rounded="full"
								onClick={() => handleModalClose(true)}
								size="sm"
								className="mt-1 border border-base-300/70 px-5 bg-base-300/70 hover:!bg-primary hover:text-white hover:border-primary"
							>
								افزودن ارز
							</Button>
						</div>
					) : (
						<div
							className={`mt-2 flex flex-col w-full gap-1 ${inComboWidget ? '' : 'overflow-y-auto'}`}
							style={{
								scrollbarWidth: 'none',
							}}
						>
							{selectedCurrencies.map((currency, index) => (
								<div key={`${currency}-${index}`}>
									<CurrencyBox
										code={currency}
										key={`${currency}-${index}`}
										currencyColorMode={currencyColorMode}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			) : (
				<WidgetContainer
					background={enableBackground}
					className={'flex flex-col gap-1'}
				>
					<ArzHeader
						title="ویجی‌ ارز"
						onSettingsClick={() => handleModalClose(true)}
					/>

					{selectedCurrencies.length === 0 ? (
						<div
							className={
								'flex-1 flex flex-col items-center justify-center gap-y-1 px-5 py-12'
							}
						>
							<div
								className={
									'mt-1 flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300'
								}
							>
								<FiDollarSign className="text-content" size={24} />
							</div>
							<p className="text-center text-content">
								ارزهای مورد نظر خود را اضافه کنید.
							</p>
							<Button
								rounded="full"
								onClick={() => handleModalClose(true)}
								size="sm"
								className="border border-base-300/70 px-5 bg-base-300/70 hover:!bg-primary hover:text-white hover:border-primary"
							>
								افزودن ارز
							</Button>
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
									<CurrencyBox
										code={currency}
										key={`${currency}-${index}`}
										currencyColorMode={currencyColorMode}
									/>
								</div>
							))}
						</div>
					)}
				</WidgetContainer>
			)}

			<SelectCurrencyModal show={showModal} setShow={handleModalClose} />
		</>
	)
}
