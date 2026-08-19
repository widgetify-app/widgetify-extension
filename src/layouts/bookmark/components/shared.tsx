import { Button, ItemSelector } from '@/components/ui'
import type { BookmarkType } from '../types/bookmark.types'
import { Icon } from '@/src/icons'

export type IconSourceType = 'auto' | 'upload' | 'url'

export function TypeSelector({
	type,
	setType,
}: {
	type: BookmarkType
	setType: (type: BookmarkType) => void
}) {
	return (
		<div className="grid grid-cols-2 gap-2">
			<ItemSelector
				isActive={type === 'BOOKMARK'}
				onClick={() => setType('BOOKMARK')}
				label={
					<div
						className={`flex items-center gap-1 ${type === 'BOOKMARK' ? 'text-primary' : 'text-muted'}`}
					>
						<Icon name="bookmark" />
						بوکمارک
					</div>
				}
				className="p-2! h-auto min-h-[56px]"
				description="ذخیره یک لینک یا وب‌سایت"
			/>
			<ItemSelector
				isActive={type === 'FOLDER'}
				onClick={() => setType('FOLDER')}
				label={
					<div
						className={`flex items-center gap-1 ${type === 'FOLDER' ? 'text-primary' : 'text-muted'}`}
					>
						<Icon name="folder" />
						پوشه
					</div>
				}
				className="p-2! h-auto min-h-[56px]"
				description="دسته‌بندی و مرتب‌سازی بوکمارک‌ها"
			/>
		</div>
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
		<Button
			type="button"
			onClick={() => setShowAdvanced(!showAdvanced)}
			size="md"
			rounded="2xl"
			variant="default"
			className="text-muted"
		>
			<span>{showAdvanced ? 'گزینه‌های کمتر' : 'گزینه‌های بیشتر'}</span>
			<Icon
				name="chevronUp"
				size={16}
				className={`transition-all duration-300 ${showAdvanced ? 'rotate-0' : 'rotate-180'}`}
			/>
		</Button>
	)
}
