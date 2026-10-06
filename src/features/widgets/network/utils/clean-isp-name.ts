const COMPANY_WORDS = /Company|Co\.|LLC|Inc\.|Corp\.|Ltd\.|Joint Stock/gi

export function cleanIspName(isp: string): string {
	const name = isp
		.replace(/\(.*?\)/g, '')
		.replace(COMPANY_WORDS, '')
		.replace(/\s+/g, ' ')
		.trim()

	return name || isp
}
