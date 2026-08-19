import { ItemSelector } from '@/components/ui'
import { SectionPanel } from '@/components/ui'
import { UI, useAppearanceSetting } from '@/context/appearance.context'
import { Icon } from '@/src/icons'

export function UISelector() {
	const { setUI, ui } = useAppearanceSetting()
	function onClick(item: UI) {
		setUI(item)
	}

	return (
		<SectionPanel
			title={
				<div className="flex items-center">
					<p>رابط کاربری</p>
					<span className="mr-1 text-white badge badge-error badge-xs outline-2 outline-error/20">
						جدید
					</span>
				</div>
			}
			size="sm"
		>
			<div className="space-y-4">
				<div className="flex flex-col gap-1">
					<p className="text-xs text-muted">
						ظاهر محیط افزونه خود را بر اساس نیازتان شخصی‌سازی کنید.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
					<ItemSelector
						isActive={ui === UI.DEFAULT || (ui as string) === 'ADVANCED'}
						onClick={() => onClick(UI.DEFAULT)}
						label={
							<div className="flex items-center gap-2">
								<Icon
									name="advanced_ui"
									size={16}
									className="text-primary/80"
								/>
								<span>پیش‌فرض</span>
							</div>
						}
						description="چیدمان استاندارد، منظم و یکپارچه ویجت‌ها."
					/>
					<ItemSelector
						isActive={ui === UI.SIMPLE}
						onClick={() => onClick(UI.SIMPLE)}
						label={
							<div className="flex items-center gap-2">
								<Icon
									name="simple_ui"
									size={16}
									className="text-primary/80"
								/>
								<span>ساده و خلوت</span>
							</div>
						}
						description="خلوت، سریع و چشم‌نواز؛ برای وقتی که تمرکز مهمه."
					/>
					<ItemSelector
						isActive={ui === UI.CUSTOM}
						onClick={() => onClick(UI.CUSTOM)}
						label={
							<div className="flex items-center gap-2">
								<Icon
									name="platforms"
									size={16}
									className="text-primary/80"
								/>
								<span>شخصی‌سازی</span>
							</div>
						}
						description="چیدمان آزادانه روی بوم با تغییر سایز و جابجایی ویجت‌ها."
					/>
				</div>
			</div>
		</SectionPanel>
	)
}
