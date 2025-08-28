import { FaCog } from 'react-icons/fa'
import { getFromStorage, setToStorage } from '@/common/storage'
import { Button } from '@/components/button/button'
import { useDate } from '@/context/date.context'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { combineAndSortEvents } from '../../tools/events/utils'
import { WigiPadDateSettingsModal } from './components/date-settings-modal'
import { GregorianDate } from './dates/gregorian.date'
import { JalaliDate } from './dates/jalali.date'
import { type WigiPadDateOptions, WigiPadDateType } from './types'

export function DateDisplay() {
	const [wigiPadDateSettings, setWigiPadDateSettings] =
		useState<WigiPadDateOptions | null>(null)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	const { today, todayIsHoliday } = useDate()
	const { data: events } = useGetEvents()
	const sortedEvents = combineAndSortEvents(events, today.clone(), [])
	const isHoliday = sortedEvents.some((event) => event.isHoliday) || todayIsHoliday
	const isDayTime = today.hour() >= 6 && today.hour() < 18

	const textColor = isHoliday
		? 'text-error drop-shadow-md'
		: isDayTime
			? 'text-content drop-shadow-md'
			: 'text-primary drop-shadow-sm'

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

		load()
	}, [])

	if (!wigiPadDateSettings) {
		return null
	}

	async function updateDateSetting(newSetting: WigiPadDateOptions) {
		setWigiPadDateSettings(newSetting)
		await setToStorage('wigiPadDate', newSetting)
		setIsSettingsOpen(false)
	}

	return (
		<div
			className={
				'relative flex flex-col items-center justify-center gap-0.5 p-1 overflow-hidden text-center transition-all duration-500 rounded-xl group'
			}
		>
			{isHoliday && (
				<>
					<div className="absolute px-2 py-1 text-xs transform rotate-45 shadow-xl text-error-content -right-10 w-28 top-1 bg-error">
						<div className="relative z-10 font-semibold tracking-wide">
							تعطیل
						</div>
						<div className="absolute inset-0 opacity-50 bg-error/80 blur-xs" />
					</div>
					<div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-error/5 via-transparent to-error/10" />
					<div className="absolute w-2 h-2 rounded-full top-2 left-2 bg-error/30 animate-pulse" />
					<div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-error/20 rounded-full animate-pulse delay-300" />{' '}
				</>
			)}

			<div className="absolute inset-0 z-20 group">
				<Button
					onClick={() => setIsSettingsOpen(true)}
					size="xs"
					className="m-1.5 h-5 w-5 p-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 !border-none !shadow-none transition-all duration-300 delay-200"
				>
					<FaCog size={12} className="text-content" />
				</Button>
			</div>

			{wigiPadDateSettings.dateType === WigiPadDateType.Jalali ? (
				<JalaliDate today={today} textColor={textColor} />
			) : (
				<GregorianDate today={today} textColor={textColor} />
			)}

			<WigiPadDateSettingsModal
				dateSetting={wigiPadDateSettings}
				isOpen={isSettingsOpen}
				onClose={updateDateSetting}
				key={'wigipad-date-modal'}
			/>
		</div>
	)
}
