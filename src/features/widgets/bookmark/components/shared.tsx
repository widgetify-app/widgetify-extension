import { t } from '@/common/i18n'
import { Button, ItemSelector } from '@/components/ui'
import type { BookmarkType } from '@/services/bookmark/bookmark.interface'
import { Icon } from '@/icons'

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
						className={`flex items-center gap-1 ${type === 'BOOKMARK' ? 'text-brand' : 'text-fg-muted'}`}
					>
						<Icon name="bookmark" />
						{t('widgets.bookmark.modal.edit.bookmark')}
					</div>
				}
				className="p-2! h-auto min-h-[56px]"
				description={t('widgets.bookmark.shared.keepLink')}
			/>
			<ItemSelector
				isActive={type === 'FOLDER'}
				onClick={() => setType('FOLDER')}
				label={
					<div
						className={`flex items-center gap-1 ${type === 'FOLDER' ? 'text-brand' : 'text-fg-muted'}`}
					>
						<Icon name="folder" />
						{t('widgets.bookmark.modal.edit.folder')}
					</div>
				}
				className="p-2! h-auto min-h-[56px]"
				description={t('widgets.bookmark.shared.organize')}
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
			variant="ghost"
		>
			<span>
				{showAdvanced
					? t('widgets.bookmark.shared.fewerOptions')
					: t('widgets.bookmark.shared.moreOptions')}
			</span>
			<Icon
				name="chevronUp"
				size={16}
				className={`transition-ui duration-300 ${showAdvanced ? 'rotate-0' : 'rotate-180'}`}
			/>
		</Button>
	)
}
