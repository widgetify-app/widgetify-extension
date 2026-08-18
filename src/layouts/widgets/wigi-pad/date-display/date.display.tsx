import { getFromStorage } from '@/common/storage'
import { listenEvent } from '@/common/utils/call-event'
import { type WigiPadDateSetting, WigiPadDateType } from './date-setting.interface'
import { GregorianDate } from './dates/gregorian.date'
import { JalaliDate } from './dates/jalali.date'

export function DateDisplay() {
	const [wigiPadDateSettings, setWigiPadDateSettings] =
		useState<WigiPadDateSetting | null>(null)
	useEffect(() => {
		async function load() {
			const wigiPadDateFromStore = await getFromStorage('wigiPadDate')
			if (wigiPadDateFromStore) {
				setWigiPadDateSettings(wigiPadDateFromStore)
			} else {
				setWigiPadDateSettings({
					dateType: WigiPadDateType.Jalali,
				})
			}
		}

		const event = listenEvent('wigiPadDateSettingsChanged', (data) => {
			setWigiPadDateSettings({ dateType: data.dateType })
		})

		load()

		return () => {
			event()
		}
	}, [])

	if (!wigiPadDateSettings) {
		return null
	}

	return (
		<div
			className={
				'relative flex flex-col items-center justify-center gap-0.5 p-1 overflow-hidden text-center transition-all duration-500 rounded-xl group '
			}
		>
			{wigiPadDateSettings.dateType === WigiPadDateType.Jalali ? (
				<JalaliDate />
			) : (
				<GregorianDate />
			)}
		</div>
	)
}
