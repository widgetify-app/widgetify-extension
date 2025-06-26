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
	const { selectedCurrencies } = useCurrencyStore()
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
				<div className="mt-2 flex items-center justify-between pb-2">
					{selectedCurrencies.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center">
							<FiDollarSign className="w-12 h-12 mb-3 opacity-30" />
							<p className="text-sm opacity-50">
								ارزهای مورد نظر خود را اضافه کنید
							</p>
							<Button
								className={'mt-3'}
								rounded="lg"
								onClick={() => handleModalClose(true)}
								size="md"
							>
								افزودن ارز
							</Button>
						</div>
					) : (
						<div
							className={`flex flex-col w-full gap-1 ${inComboWidget ? '' : 'overflow-y-auto'}`}
							style={{
								scrollbarWidth: 'none',
							}}
						>
							{selectedCurrencies.map((currency, index) => (
								<div key={`${currency}-${index}`}>
									<CurrencyBox
										code={currency}
										key={`${currency}-${index}`}
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
						<div className="flex flex-col items-center justify-center h-full text-center">
							<FiDollarSign className="w-12 h-12 mb-3 opacity-30" />
							<p className="text-sm opacity-50">
								ارزهای مورد نظر خود را اضافه کنید
							</p>
							<Button
								className={'mt-3'}
								rounded="lg"
								onClick={() => handleModalClose(true)}
								size="md"
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
