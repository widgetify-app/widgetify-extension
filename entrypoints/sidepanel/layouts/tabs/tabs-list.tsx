import { LoadingSpinner } from '../../components/loading-spinner'
import { useFavoriteStore } from '../../context/favorite.context'
import { PermissionRequest } from './components/permission-request'
import { TabGroup as TabGroupComponent } from './components/tab-group'
import { TabItem } from './components/tab-item'
import { useTabsManager } from './hooks/useTabsManager'

export function TabsList() {
	const {
		tabs,
		groups,
		loading,
		hasPermission,
		requestPermissions,
		switchToTab,
		closeTab,
		reloadTab,
		toggleMute,
	} = useTabsManager()
	const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore()

	if (loading) {
		return <LoadingSpinner />
	}

	if (!hasPermission) {
		return <PermissionRequest onRequest={requestPermissions} />
	}

	const ungroupedTabs = tabs.filter((tab) => {
		return !groups.some((group) => group.tabs.some((t) => t.id === tab.id))
	})

	const onToggleFavorite = (tabId: number, e: React.MouseEvent) => {
		e.stopPropagation()
		const tab = tabs.find((t) => t.id === tabId)
		if (!tab) return
		if (isFavorite(tab.url)) {
			removeFavorite(tab.url)
		} else {
			addFavorite({
				title: tab.title,
				url: tab.url,
				favicon: tab.favIconUrl,
				order: 0,
			})
		}
	}

	return (
		<div className="py-2 px-2 space-y-2 overflow-y-auto h-[33.8rem]">
			{groups.map((group) => (
				<TabGroupComponent
					key={group.id}
					group={group}
					onSwitch={switchToTab}
					onClose={closeTab}
					onReload={reloadTab}
					onToggleMute={toggleMute}
					onToggleFavorite={onToggleFavorite}
				/>
			))}

			{ungroupedTabs.map((tab) => (
				<TabItem
					key={tab.id}
					tab={tab}
					onSwitch={switchToTab}
					onClose={closeTab}
					onReload={reloadTab}
					onToggleMute={toggleMute}
					isFavorite={isFavorite(tab.url)}
					onToggleFavorite={onToggleFavorite}
				/>
			))}
		</div>
	)
}
