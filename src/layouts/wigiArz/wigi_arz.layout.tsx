import { useCurrencyStore } from '@/context/currency.context'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiDollarSign } from 'react-icons/fi'
import { SelectCurrencyModal } from './components/addCurrency-box'
import { ArzHeader } from './components/arz-header'
import { CurrencyBox } from './components/currency-box'

export function WigiArzLayout() {
	const { selectedCurrencies } = useCurrencyStore()
	const { themeUtils } = useTheme()
	const [showModal, setShowModal] = useState(false)

	return (
		<div className="relative">
			<SelectCurrencyModal show={showModal} setShow={setShowModal} />

			<div
				className={`flex flex-col gap-1 px-2 py-2 rounded-2xl h-80 ${themeUtils.getCardBackground()}`}
			>
				<ArzHeader title="ویجی‌ ارز" onSettingsClick={() => setShowModal(true)} />

				{selectedCurrencies.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center">
						<FiDollarSign className="w-12 h-12 mb-3 opacity-30" />
						<p className="text-sm opacity-50">ارزهای مورد نظر خود را اضافه کنید</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className={`mt-3 px-4 py-1.5 cursor-pointer rounded-lg ${themeUtils.getButtonStyles()}`}
							onClick={() => setShowModal(true)}
						>
							افزودن ارز
						</motion.button>
					</div>
				) : (
					<div
						className="flex flex-col gap-1 overflow-y-auto"
						style={{
							scrollbarWidth: 'none',
							height: 'calc(100% - 40px)',
							maxHeight: 'calc(100% - 40px)',
						}}
					>
						{selectedCurrencies.map((currency, index) => (
							<div key={`${currency}-${index}`}>
								<CurrencyBox code={currency} key={`${currency}-${index}`} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
