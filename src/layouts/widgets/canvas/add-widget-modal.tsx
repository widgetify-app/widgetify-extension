import { Modal } from '@/components/ui'
import { useFreeWidgets } from '@/context/free-widget.context'
import { WIDGET_DEFINITIONS } from '../widget-registry'

interface AddWidgetModalProps {
	isOpen: boolean
	onClose: () => void
}

export function AddWidgetModal({ isOpen, onClose }: AddWidgetModalProps) {
	const { runtimeLayout, addWidget } = useFreeWidgets()

	const allDefinitions = Object.values(WIDGET_DEFINITIONS)

	const handleAdd = async (id: string) => {
		const success = await addWidget(id)
		if (success) {
			onClose()
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="افزودن ویجت جدید"
			size="xl"
			direction="rtl"
			closeOnBackdropClick={true}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto p-1 scrollbar-none">
				{allDefinitions.map((def) => {
					const isCurrentlyActive = runtimeLayout.some((w) => w.id === def.id)
					const canAdd = def.canDuplicate || !isCurrentlyActive

					return (
						<div
							key={def.id}
							className={`flex flex-col justify-between p-3 rounded-2xl bg-base-200/80 border border-base-content/10 transition-all duration-200 ${
								canAdd
									? 'hover:border-primary/50 hover:shadow-md cursor-pointer'
									: 'opacity-60'
							}`}
							onClick={() => canAdd && handleAdd(def.id)}
						>
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-1.5 font-bold text-content text-sm">
									<span className="text-lg">{def.emoji}</span>
									<span>{def.label}</span>
								</div>
								<span className="text-[11px] text-muted bg-base-300/60 px-1.5 py-0.5 rounded-md">
									{def.defaultSize.w}×{def.defaultSize.h}
								</span>
							</div>

							<div className="my-2 pointer-events-none select-none">
								{def.preview()}
							</div>

							<div className="mt-2 pt-2 border-t border-base-content/10 flex justify-between items-center">
								{isCurrentlyActive && (
									<span className="text-[11px] text-muted">
										{def.canDuplicate
											? 'فعال (امکان تکرار)'
											: 'قبلاً اضافه شده'}
									</span>
								)}
								{!isCurrentlyActive && (
									<span className="text-[11px] text-muted">
										آماده افزودن
									</span>
								)}

								<button
									type="button"
									disabled={!canAdd}
									onClick={(e) => {
										e.stopPropagation()
										if (canAdd) handleAdd(def.id)
									}}
									className={`px-3 py-1 text-xs rounded-xl font-medium transition-colors ${
										canAdd
											? 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
											: 'bg-base-300 text-muted cursor-not-allowed'
									}`}
								>
									{canAdd ? 'افزودن' : 'موجود'}
								</button>
							</div>
						</div>
					)
				})}
			</div>
		</Modal>
	)
}
