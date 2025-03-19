import { type ForwardedRef, forwardRef } from 'react'
import { TextInput } from '@/components/text-input'
import { useTheme } from '@/context/theme.context'

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
	) => {
		const { theme } = useTheme()

		const getSpinnerStyle = () => {
			switch (theme) {
				case 'light':
					return 'border-gray-300 border-t-blue-600'
				case 'dark':
					return 'border-gray-600 border-t-blue-400'
				default: // glass
					return 'border-gray-600 border-t-blue-400'
			}
		}

		return (
			<div className="relative">
				<TextInput
					ref={ref}
					value={value}
					onChange={onChange}
					onFocus={onFocus}
					theme={theme}
					placeholder="نام شهر را جستجو کنید..."
				/>
				{isLoading && (
					<div className="absolute -translate-y-1/2 left-3 top-1/2">
						<div
							className={`w-4 h-4 border-2 rounded-full animate-spin ${getSpinnerStyle()}`}
						></div>
					</div>
				)}
			</div>
		)
	},
)

CitySearchInput.displayName = 'CitySearchInput'
