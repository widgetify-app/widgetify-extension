import { type ForwardedRef, forwardRef } from 'react'
import { TextInput } from '../../../../components/text-input'

interface CitySearchInputProps {
	value: string
	onChange: (e: string) => void
	onFocus: () => void
	isLoading: boolean
}

export const CitySearchInput = forwardRef(
	(
		{ value, onChange, onFocus, isLoading }: CitySearchInputProps,
		ref: ForwardedRef<HTMLInputElement>,
	) => (
		<div className="relative">
			<TextInput
				ref={ref}
				value={value}
				onChange={onChange}
				onFocus={onFocus}
				placeholder="نام شهر را جستجو کنید..."
			/>
			{isLoading && (
				<div className="absolute -translate-y-1/2 left-3 top-1/2">
					<div className="w-4 h-4 border-2 border-gray-600 rounded-full border-t-blue-400 animate-spin"></div>
				</div>
			)}
		</div>
	),
)

CitySearchInput.displayName = 'CitySearchInput'
