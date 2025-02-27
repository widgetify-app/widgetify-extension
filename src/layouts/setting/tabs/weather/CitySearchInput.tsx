import { motion } from 'motion/react'
import { type ForwardedRef, forwardRef } from 'react'
import { TextInput } from '../../../../components/text-input'

interface CitySearchInputProps {
	value: string
	onChange: (value: string) => void
	isLoading: boolean
}

export const CitySearchInput = forwardRef(
	(
		{ value, onChange, isLoading }: CitySearchInputProps,
		ref: ForwardedRef<HTMLInputElement>,
	) => (
		<div className="relative">
			<TextInput
				ref={ref}
				value={value}
				onChange={onChange}
				placeholder="نام شهر را وارد کنید ..."
			/>
			{isLoading && (
				<motion.div
					className="absolute -translate-y-1/2 left-3 top-1/2"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<div className="w-5 h-5 border-2 border-t-2 border-blue-500 rounded-full border-opacity-30 animate-spin border-t-blue-500" />
				</motion.div>
			)}
		</div>
	),
)
