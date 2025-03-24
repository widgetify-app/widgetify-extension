import { useCurrencyStore } from '@/context/currency.context'
import { useTheme } from '@/context/theme.context'
import { useGetSupportCurrencies } from '@/services/getMethodHooks/getSupportCurrencies.hook'
import { motion } from 'framer-motion'
import { FiDollarSign } from 'react-icons/fi'
import { AddCurrencyBox } from './components/addCurrency-box'
import { CurrencyBox } from './components/currency-box'

export function ArzLiveLayout() {
	const { data } = useGetSupportCurrencies()
	const { selectedCurrencies } = useCurrencyStore()
	const { theme, themeUtils } = useTheme()

	return (
		<div className="relative">
			<div
				className={`flex flex-col gap-1 px-2 py-2 rounded-2xl h-80 ${themeUtils.getCardBackground()} overflow-y-auto`}
				style={{
					scrollbarWidth: 'none',
				}}
			>
				{selectedCurrencies.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center">
						<FiDollarSign className="w-12 h-12 mb-3 opacity-30" />
						<p className="text-sm opacity-50">ارزهای مورد نظر خود را اضافه کنید</p>
					</div>
				) : (
					<>
						{selectedCurrencies.map((currency, index) => (
							<motion.div
								key={`${currency}-${index}`}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<CurrencyBox code={currency} />
							</motion.div>
						))}
					</>
				)}

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.2 }}
					className="sticky bottom-0 pt-1 mt-auto shadow-inner"
				>
					<AddCurrencyBox supportCurrencies={data || []} theme={theme} />
				</motion.div>
			</div>
		</div>
	)
}
