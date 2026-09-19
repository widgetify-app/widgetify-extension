import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { Dropdown } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { useChangeSearchEngine } from '@/services/hooks/extension/update-setting.hook'
import {
	type EngineMeta,
	useGetSearchboxData,
} from '@/services/hooks/trends/get-trends.hook'
import { DEFAULT_ENGINE } from '../constants'

type EngineSelectorProps = {
	onSelected?: (engine: EngineMeta) => void
	trigger?: ReactNode
}

export function EngineSelector({ trigger, onSelected }: EngineSelectorProps) {
	const { isAuthenticated } = useAuth()
	const { data: searchboxData, isLoading } = useGetSearchboxData({ enabled: true })
	const changeEngineMutation = useChangeSearchEngine()
	const [currentEngine, setCurrentEngine] = useState<EngineMeta>(DEFAULT_ENGINE)
	const [isExpanded, setIsExpanded] = useState(false)

	const engines = useMemo(() => {
		if (searchboxData?.search_engines?.length) {
			return [DEFAULT_ENGINE, ...searchboxData.search_engines]
		}
		return [DEFAULT_ENGINE]
	}, [searchboxData?.search_engines])

	const findEngine = (engineId: string): EngineMeta => {
		return engines.find((engine) => engine.id === engineId) || DEFAULT_ENGINE
	}

	useEffect(() => {
		const loadInitialEngine = async () => {
			const savedEngineId = await getFromStorage('selected_engine')
			if (savedEngineId) {
				const engine = findEngine(savedEngineId)
				setCurrentEngine(engine)
				onSelected?.(engine)
			}
		}
		loadInitialEngine()
	}, [engines])

	useEffect(() => {
		if (!searchboxData?.selected_engine) return

		const serverEngine = findEngine(searchboxData.selected_engine)
		if (serverEngine.id !== currentEngine.id) {
			setCurrentEngine(serverEngine)
			onSelected?.(serverEngine)
			setToStorage('selected_engine', serverEngine.id)
		}
	}, [searchboxData?.selected_engine, engines])

	const handleSelect = async (engine: EngineMeta) => {
		if (!isAuthenticated) {
			callEvent('open_require_auth_modal')
			return
		}

		setCurrentEngine(engine)
		callEvent('closeAllDropdowns')

		await setToStorage('selected_engine', engine.id)
		changeEngineMutation.mutate({ search_engine: engine.id })

		onSelected?.(engine)
	}

	return (
		<Dropdown
			trigger={
				trigger || (
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						type="button"
						aria-label={`موتور جستجو: ${currentEngine.label}`}
						className="relative flex gap-0.5 items-center justify-start w-10 pr-1 ml-2 transition-all duration-300 cursor-pointer h-7 shrink-0 bg-raised opacity-70 hover:opacity-100 rounded-xl"
					>
						<EngineIcon
							engineId={currentEngine.id}
							icon={currentEngine.icon}
						/>
						<Icon
							name="chevronDown"
							aria-hidden="true"
							className={`shrink-0 text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
							size={12}
						/>
					</button>
				)
			}
			onClose={() => setIsExpanded(false)}
			dropdownClassName="engine-selector"
		>
			<div className="flex flex-col gap-1 p-2 border-2 rounded-2xl min-w-40 bg-content border-content">
				<p className="px-2 mb-1 text-xs font-medium text-muted">
					انتخاب موتور جستجو
				</p>

				{engines.map((engine) => {
					const isCurrent = currentEngine.id === engine.id

					return (
						<button
							key={engine.id}
							type="button"
							onClick={() => handleSelect(engine)}
							disabled={changeEngineMutation.isPending}
							aria-pressed={isCurrent}
							className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-xl transition-ui focus-visible:focus-ring ${
								isCurrent ? 'bg-hovered' : 'hover:bg-subtle'
							}`}
						>
							<span className="flex items-center justify-center w-5 h-5 shrink-0">
								<EngineIcon
									engineId={engine.id}
									icon={engine.icon}
									label={engine.label}
								/>
							</span>
							<span className="text-sm font-medium">{engine.label}</span>
							{isCurrent && (
								<span className="w-2 h-2 mr-auto rounded-full bg-primary" />
							)}
						</button>
					)
				})}

				{isLoading &&
					[...Array(3)].map((_, i) => (
						<div
							key={`loading_${i}`}
							aria-hidden="true"
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
		return (
			<Icon
				name="googleLogo"
				size={20}
				opacity={0.8}
				aria-hidden="true"
				className="shrink-0"
			/>
		)
	}

	return (
		<img
			width={20}
			height={20}
			src={icon}
			alt={label ?? ''}
			className="object-contain w-5 h-5 rounded-sm shrink-0"
			loading="lazy"
		/>
	)
}
