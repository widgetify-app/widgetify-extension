import { FaCog } from 'react-icons/fa'
import { getFromStorage, setToStorage } from '@/common/storage'
import { Button } from '@/components/button/button'
import { WigiPadDateSettingsModal } from './components/date-settings-modal'
import { GregorianDate } from './dates/gregorian.date'
import { JalaliDate } from './dates/jalali.date'
import { type WigiPadDateOptions, WigiPadDateType } from './types'

export function DateDisplay() {
	const [wigiPadDateSettings, setWigiPadDateSettings] =
		useState<WigiPadDateOptions | null>(null)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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
				<JalaliDate />
			) : (
				<GregorianDate />
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
