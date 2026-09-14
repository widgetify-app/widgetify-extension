export function renderDigitSlots(value: string) {
	return value.split('').map((digit, index) => (
		<span
			key={index}
			style={{ display: 'inline-block', width: '0.62em', textAlign: 'center' }}
		>
			{digit}
		</span>
	))
}
