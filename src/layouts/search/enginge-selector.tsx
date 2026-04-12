import { getFromStorage } from '@/common/storage'
import { NewBadge } from '@/components/badges/new.badge'
import { Dropdown } from '@/components/dropdown'
import { type EngineMeta, useGetSearchboxData } from '@/services/hooks/trends/getTrends'
import type { ReactNode } from 'react'
import { useState, useEffect, useMemo } from 'react'
import { FcGoogle } from 'react-icons/fc'

const GOOGLE: EngineMeta = {
	id: 'google' as string,
	prefix: '',
	label: 'گوگل',
	icon: '',
}

type EngineSelectorProps = {
	onSelected: any
	selected: EngineMeta | null
	trigger?: ReactNode
	showNewBadge?: boolean
}

export function EngineSelector({
	trigger,
	onSelected,
	selected,
	showNewBadge,
}: EngineSelectorProps) {
	const { data: fetchedEngines, isLoading } = useGetSearchboxData({ enabled: true })
	const [currentEngine, setCurrentEngine] = useState<EngineMeta>(GOOGLE)

	const engines = useMemo(() => {
		if (fetchedEngines?.engines?.length) {
			return [GOOGLE, ...fetchedEngines.engines]
		}
		return [GOOGLE]
	}, [fetchedEngines])

	useEffect(() => {
		const fetchDataFromStorage = async () => {
			const savedEngine = await getFromStorage('selected_engine')
			if (savedEngine) {
				setCurrentEngine(savedEngine)
			} else {
				onSelected(GOOGLE)
			}
		}

		fetchDataFromStorage()
	}, [])

	useEffect(() => {
		if (selected) setCurrentEngine(selected)
	}, [selected])

	const handleSelect = (eng: EngineMeta) => {
		onSelected(eng)
		setCurrentEngine(eng)
	}

	return (
		<Dropdown
			trigger={
				trigger || (
					<button
						type="button"
						className={
							'relative h-8 w-8 shrink-0 hover:bg-base-content/10 cursor-pointer ml-2 flex items-center justify-center rounded-full opacity-70 hover:opacity-100 bg-base-300 transition-all duration-300'
						}
					>
						<EngineIcon
							engineId={currentEngine.id}
							icon={currentEngine.icon}
						/>
						{showNewBadge && <NewBadge className="right-1 bottom-1" />}
					</button>
				)
			}
			dropdownClassName="engine-selector"
		>
			<div className="flex flex-col gap-1 p-2 min-w-40">
				<p className="px-2 mb-1 text-xs font-medium text-base-content/60">
					انتخاب موتور جستجو
				</p>
				{engines.map((engine) => (
					<button
						key={engine.id}
						onClick={() => handleSelect(engine)}
						className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-xl transition-all duration-200 ${
							currentEngine?.id === engine.id
								? 'bg-base-content/10'
								: 'hover:bg-base-content/5'
						}`}
					>
						<div className="flex items-center justify-center w-5 h-5">
							<EngineIcon
								engineId={engine.id}
								icon={engine.icon}
								label={engine.label}
							/>
						</div>
						<span className="text-sm font-medium">{engine.label}</span>
						{currentEngine?.id === engine.id && (
							<div className="w-2 h-2 mr-auto rounded-full bg-primary"></div>
						)}
					</button>
				))}

				{isLoading &&
					[...Array(3)].map((_, i) => (
						<div
							key={`note_${i}`}
							className="flex items-center gap-2 px-3 py-2"
						>
							<div className="w-5 h-5 rounded-full skeleton" />
							<div className="flex-1 w-full h-4 rounded-sm skeleton" />
						</div>
					))}
			</div>
		</Dropdown>
	)
}

interface Prop {
	engineId: string
	icon?: string
	label?: string
}
function EngineIcon({ engineId, icon, label }: Prop) {
	if (engineId === 'google') {
		return <FcGoogle size={20} opacity={0.8} />
	}
	return <img width={20} height={20} src={icon} alt={label} className="rounded-sm" />
}
