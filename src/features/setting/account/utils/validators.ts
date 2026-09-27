export const isEmpty = (text: string) => (text.trim() === '' ? true : false)

export const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isNumber = (value: string) => /^\d+$/.test(value)

export const isLessThan = (text: string, length: number) =>
	text.trim().length < length ? true : false
