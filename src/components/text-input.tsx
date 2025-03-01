import type React from 'react'

interface TextInputProp {
	ref?: React.LegacyRef<HTMLInputElement>
	value: string
	onChange: (value: string) => void
	placeholder?: string
}

export function TextInput({ onChange, ref, value, placeholder }: TextInputProp) {
	return (
		<input
			ref={ref}
			type="text"
			value={value}
			placeholder={placeholder || ''}
			className="w-full bg-white/5 text-gray-200 text-[14px] rounded-xl p-3
              outline-none border border-white/10 transition-all duration-200  
              focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
              placeholder-gray-400 hover:bg-white/10"
			onChange={(e) => onChange(e.target.value)}
		/>
	)
}
