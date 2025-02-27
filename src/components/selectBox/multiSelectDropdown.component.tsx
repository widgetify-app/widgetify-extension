import { useEffect, useRef } from 'react'
import Select, { type InputActionMeta, type SelectInstance } from 'react-select'

interface Option {
	value: string
	label: string
	labelEn?: string
}

interface OptionsGroup {
	label: string
	options: Option[]
}

interface MultiSelectDropdownProps {
	options: Option[] | OptionsGroup
	values: {
		value: string
		label: string
	}[]
	limit?: number
	onChange: (values: string[]) => void
	placeholder?: string
}

function isTouchCapable() {
	try {
		document.createEvent('TouchEvent')
		return true
	} catch (e) {
		console.log('notsp======')
		return false
	}
}

export const MultiSelectDropdown = ({
	options,
	values,
	limit,
	onChange,
	placeholder,
}: MultiSelectDropdownProps) => {
	const selectRef = useRef<SelectInstance<Option> | null>(null)

	const handleChange = (selectedValue: any) => {
		if (!selectedValue) return []
		if (limit && selectedValue?.length > limit) return values
		const selectedValuesMapped = selectedValue.map((value: { value: any }) => value.value)
		return onChange(selectedValuesMapped)
	}

	// Avoid input reset on select item
	// @see https://github.com/JedWatson/react-select/blob/master/storybook/stories/OnSelectKeepsInput.stories.tsx
	const handleInputChange = (
		inputValue: string,
		{ action, prevInputValue }: InputActionMeta,
	) => (action === 'input-change' ? inputValue : prevInputValue)

	// I specifically avoided using the `blurInputOnSelect` prop because it causes
	// an undesirable lag. When `blurInputOnSelect` is enabled, the input briefly gains
	// focus and then blurs, which creates a flickering effect and feels unpolished.
	// This custom solution ensures that the input never gains focus during events like
	// "add" or "remove", while still allowing the user to focus it by clicking.
	useEffect(() => {
		if (selectRef.current) {
			if (!selectRef.current.inputRef) {
				return
			}

			// Override the focus method to prevent auto-focus
			const originalFocus = selectRef.current.inputRef.focus
			selectRef.current.inputRef.focus = () => null

			// Override the onControlMouseDown method to temporarily restore the original focus
			// behavior during user interactions (e.g., clicking on the search input)
			const originalOnControlMouseDown = selectRef.current.onControlMouseDown
			selectRef.current.onControlMouseDown = (...args) => {
				if (!selectRef.current || !selectRef.current.inputRef) {
					return
				}

				selectRef.current.inputRef.focus = originalFocus
				originalOnControlMouseDown(...args)
				selectRef.current.inputRef.focus = () => null
			}

			// Cleanup on unmount
			return () => {
				if (selectRef.current) {
					selectRef.current.onControlMouseDown = originalOnControlMouseDown

					if (selectRef.current.inputRef) {
						selectRef.current.inputRef.focus = originalFocus
					}
				}
			}
		}
	}, [])

	return (
		<div className="relative custom-select-box">
			<Select
				ref={selectRef}
				value={values}
				options={options as any}
				onChange={handleChange}
				onInputChange={handleInputChange}
				placeholder={placeholder}
				isMulti={true}
				autoFocus={!isTouchCapable()}
				menuIsOpen={true}
				isClearable={false}
				isSearchable={true}
				blurInputOnSelect={false}
				closeMenuOnSelect={false}
				closeMenuOnScroll={false}
				hideSelectedOptions={false}
				backspaceRemovesValue={false}
				controlShouldRenderValue={false}
				menuPlacement="bottom"
				formatOptionLabel={(option: Option) =>
					option.labelEn ? (
						<div className="flex justify-between">
							<span>{option.label}</span>
							<span>{option.labelEn}</span>
						</div>
					) : (
						option.label
					)
				}
				styles={{
					control: (base) => ({
						...base,
						backgroundColor: undefined,
						borderColor: undefined,
					}),
					input: (base) => ({
						...base,
						cursor: 'text',
						padding: 0,
						margin: 0,
						color: undefined,
					}),
					menu: (base) => ({
						...base,
						position: 'relative',
						marginBottom: 0,
						marginTop: undefined,
						backgroundColor: undefined,
						borderColor: undefined,
						boxShadow: undefined,
					}),
					menuList: (base) => ({
						...base,
						paddingTop: undefined,
						paddingBottom: undefined,
					}),
					groupHeading: (base) => ({
						...base,
						fontWeight: undefined,
						fontSize: undefined,
						color: undefined,
					}),
					option: (base) => ({
						...base,
						cursor: 'pointer',
						backgroundColor: undefined,
						borderColor: undefined,
						color: undefined,
						':active': {
							backgroundColor: undefined,
						},
					}),
					indicatorsContainer: () => ({
						display: 'none',
					}),
				}}
				classNames={{
					control: () => `
                    	bg-white dark:bg-[#3f3f3f] 
                        border-gray-200 dark:border-gray-600`,
					input: () => `
                    	w-full dark:text-gray-100`,
					menu: () => `
                    	mt-3`,
					group: () => `
                        mb-3 last:mb-0 px-1 rounded-md shadow-xs
                        bg-white dark:bg-[#3f3f3f]  
                        border-gray-200 dark:border-gray-600`,
					groupHeading: () => `
                        w-full pb-1 bg-transparent 
                        text-gray-600 dark:text-gray-100
                        font-extrabold text-center`,
					option: (state) => `
                        w-full mb-1 last:mb-0 rounded-md 
                        text-gray-700 dark:text-gray-300
                        ${
													state.isSelected
														? `
                        	bg-green-200 dark:bg-green-400/30
                        	hover:bg-red-200 dark:hover:bg-red-400/30
                        	active:bg-red-300 dark:active:bg-red-600/30`
														: `
                            hover:bg-gray-200 dark:hover:bg-black/20
                            active:bg-gray-300 dark:active:bg-black/30`
												}`,
					menuList: () => `
						pe-1 -me-1
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-track]:rounded-lg
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        [&::-webkit-scrollbar-thumb]:rounded-lg
                        [&::-webkit-scrollbar-thumb]:border-solid
                        dark:[&::-webkit-scrollbar-thumb]:bg-gray-600
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
                        dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500
                        [&::-webkit-scrollbar-thumb]:transition-colors
                        [&::-webkit-scrollbar-thumb]:duration-200`,
				}}
			/>
		</div>
	)
}
