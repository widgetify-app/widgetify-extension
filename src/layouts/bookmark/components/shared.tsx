import { FiChevronUp } from 'react-icons/fi'
import type { BookmarkType } from '../types/bookmark.types'
import { HiOutlineBookmark, HiOutlineFolder } from 'react-icons/hi2'
import { TabNavigation } from '@/components/tab-navigation'

export type IconSourceType = 'auto' | 'upload' | 'url'

export function IconSourceSelector({
	iconSource,
	setIconSource,
}: {
	iconSource: IconSourceType
	setIconSource: (source: IconSourceType) => void
	theme?: string
}) {
	return (
		<TabNavigation<IconSourceType>
			size="small"
			tabMode="simple"
			tabs={[
				{ id: 'auto', label: 'آیکون خودکار' },
				{ id: 'upload', label: 'آپلود آیکون' },
			]}
			activeTab={iconSource}
			onTabClick={(tab) => setIconSource(tab)}
		/>
	)
}

export function TypeSelector({
	type,
	setType,
}: {
	type: BookmarkType
	setType: (type: BookmarkType) => void
}) {
	return (
		<TabNavigation<BookmarkType>
			className="w-full! border-none! h-12"
			tabMode="simple"
			size="medium"
			tabs={[
				{
					id: 'BOOKMARK',
					label: 'بوکمارک',
					icon: <HiOutlineBookmark size={14} />,
				},
				{ id: 'FOLDER', label: 'پوشه', icon: <HiOutlineFolder size={14} /> },
			]}
			activeTab={type}
			onTabClick={(tab) => setType(tab)}
		/>
	)
}

interface ShowAdvancedButtonProps {
	showAdvanced: boolean
	setShowAdvanced: (show: boolean) => void
}
export function ShowAdvancedButton({
	setShowAdvanced,
	showAdvanced,
}: ShowAdvancedButtonProps) {
	return (
		<button
			type="button"
			onClick={() => setShowAdvanced(!showAdvanced)}
			className={
				'bg-base-300 hover:bg-base-300/70 border border-base-300/70 flex items-center gap-1 px-3 py-1 text-sm font-medium transition-all duration-200 cursor-pointer text-content rounded-xl active:scale-95'
			}
		>
			<span>{showAdvanced ? 'گزینه‌های کمتر' : 'گزینه‌های بیشتر'}</span>
			<FiChevronUp
				size={16}
				className={`transition-all duration-300 ${showAdvanced ? 'rotate-0' : 'rotate-180'}`}
			/>
		</button>
	)
}
