import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { Dropdown } from '@/components/dropdown'
import { useAuth } from '@/context/auth.context'
import { useChangeSearchEngine } from '@/services/hooks/extension/updateSetting.hook'
import { type EngineMeta, useGetSearchboxData } from '@/services/hooks/trends/getTrends'
import { Icon } from '@/src/icons'
import type { ReactNode } from 'react'
import { useState, useEffect, useMemo } from 'react'

const GOOGLE: EngineMeta = {
	id: 'google',
	prefix: '',
	label: 'گوگل',
	icon: '',
}

type EngineSelectorProps = {
	onSelected?: (engine: EngineMeta) => void
	trigger?: ReactNode
}

export function EngineSelector({ trigger, onSelected }: EngineSelectorProps) {
	const { isAuthenticated } = useAuth()
	const { data: searchboxData, isLoading } = useGetSearchboxData({ enabled: true })
	const changeEngineMutation = useChangeSearchEngine()
	const [currentEngine, setCurrentEngine] = useState<EngineMeta>(GOOGLE)
	const [clicked, setClicked] = useState<boolean>(false)

	const engines = useMemo(() => {
		if (searchboxData?.search_engines?.length) {
			return [GOOGLE, ...searchboxData.search_engines]
		}
		return [GOOGLE]
	}, [searchboxData?.search_engines])

	const findEngine = (engineId: string): EngineMeta => {
		return engines.find((e) => e.id === engineId) || GOOGLE
	}

	useEffect(() => {
		const loadInitialEngine = async () => {
			const savedEngineData = await getFromStorage('selected_engine')
			if (savedEngineData) {
				const engine = findEngine(savedEngineData)
				setCurrentEngine(engine)
				onSelected?.(engine)
			}
		}
		loadInitialEngine()

		return () => {
			setClicked(false)
		}
	}, [engines])

	useEffect(() => {
		if (searchboxData?.selected_engine) {
			const serverEngine = findEngine(searchboxData.selected_engine)
			if (serverEngine.id !== currentEngine.id) {
				setCurrentEngine(serverEngine)
				onSelected?.(serverEngine)
				setToStorage('selected_engine', serverEngine.id)
			}
		}
	}, [searchboxData?.selected_engine, engines])

	const handleSelect = async (engine: EngineMeta) => {
		if (!isAuthenticated) {
			callEvent('open_require_auth_modal')
			return
		}
		setCurrentEngine(engine)

		await setToStorage('selected_engine', engine.id)

		changeEngineMutation.mutate({ search_engine: engine.id })

		onSelected?.(engine)
	}

	return (
		<Dropdown
			trigger={
				trigger || (
					<button
						onClick={() => setClicked(!clicked)}
						type="button"
						className="relative flex gap-0.5 items-center justify-start w-10 pr-1 ml-2 transition-all duration-300  cursor-pointer h-7 shrink-0 bg-base-300 opacity-70 hover:opacity-100 rounded-xl"
					>
						<EngineIcon
							engineId={currentEngine.id}
							icon={currentEngine.icon}
						/>
						<Icon
							name="chevronDown"
							className={`text-muted transition-transform duration-300 ${clicked ? 'rotate-180' : ''}`}
							size={12}
						/>
					</button>
				)
			}
			onClose={() => setClicked(false)}
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
						disabled={changeEngineMutation.isPending}
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
							<div className="w-2 h-2 mr-auto rounded-full bg-primary" />
						)}
					</button>
				))}

				{isLoading &&
					[...Array(3)].map((_, i) => (
						<div
							key={`loading_${i}`}
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

interface EngineIconProps {
	engineId: string
	icon?: string
	label?: string
}

function EngineIcon({ engineId, icon, label }: EngineIconProps) {
	if (engineId === 'google') {
		return <Icon name="googleLogo" size={20} opacity={0.8} />
	}
	return (
		<img
			width={20}
			height={20}
			src={icon}
			alt={label}
			className="rounded-sm"
			loading="lazy"
		/>
	)
}
