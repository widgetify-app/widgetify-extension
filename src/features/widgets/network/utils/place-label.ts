import { cleanIspName } from './clean-isp-name'

export function getPlaceLabel(city: string | null, isp: string | null): string {
	return [city, isp && cleanIspName(isp)].filter(Boolean).join(' · ')
}
