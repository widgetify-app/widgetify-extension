import { useEffect, useState } from 'react'
import type { Tab, TabGroup } from '../../../types/tab.types'

export function useTabsManager() {
	const [tabs, setTabs] = useState<Tab[]>([])
	const [groups, setGroups] = useState<TabGroup[]>([])
	const [loading, setLoading] = useState(true)
	const [hasPermission, setHasPermission] = useState(false)

	useEffect(() => {
		checkPermissions()
		loadTabs()

		const tabUpdateListener = () => {
			loadTabs()
		}

		browser.tabs.onCreated.addListener(tabUpdateListener)
		browser.tabs.onRemoved.addListener(tabUpdateListener)
		browser.tabs.onUpdated.addListener(tabUpdateListener)
		browser.tabs.onActivated.addListener(tabUpdateListener)
		browser.tabs.onMoved.addListener(tabUpdateListener)

		// Tab group event listeners
		if (browser.tabGroups && !import.meta.env.FIREFOX) {
			browser.tabGroups.onCreated.addListener(tabUpdateListener)
			browser.tabGroups.onRemoved.addListener(tabUpdateListener)
			browser.tabGroups.onUpdated.addListener(tabUpdateListener)
		}

		return () => {
			browser.tabs.onCreated.removeListener(tabUpdateListener)
			browser.tabs.onRemoved.removeListener(tabUpdateListener)
			browser.tabs.onUpdated.removeListener(tabUpdateListener)
			browser.tabs.onActivated.removeListener(tabUpdateListener)
			browser.tabs.onMoved.removeListener(tabUpdateListener)

			// Remove tab group event listeners
			if (browser.tabGroups && !import.meta.env.FIREFOX) {
				browser.tabGroups.onCreated.removeListener(tabUpdateListener)
				browser.tabGroups.onRemoved.removeListener(tabUpdateListener)
				browser.tabGroups.onUpdated.removeListener(tabUpdateListener)
			}
		}
	}, [])

	const checkPermissions = async () => {
		try {
			const hasTabsPermission = await browser.permissions.contains({
				permissions: ['tabs'],
			})
			const hasTabGroupsPermission = await browser.permissions.contains({
				permissions: ['tabGroups'],
			})
			setHasPermission(hasTabsPermission && hasTabGroupsPermission)
		} catch (error) {
			console.error('Error checking permissions:', error)
			setHasPermission(false)
		}
	}

	const requestPermissions = async () => {
		try {
			const granted = await browser.permissions.request({
				permissions: ['tabs', 'tabGroups'],
			})
			if (granted) {
				setHasPermission(true)
				loadTabs()
			} else {
				// Check which permissions were actually granted
				const hasTabs = await browser.permissions.contains({
					permissions: ['tabs'],
				})
				const hasTabGroups = await browser.permissions.contains({
					permissions: ['tabGroups'],
				})
				setHasPermission(hasTabs && hasTabGroups)
			}
		} catch (error) {
			console.error('Error requesting permissions:', error)
		}
	}

	const loadTabs = async () => {
		try {
			const hasTabsPermission = await browser.permissions.contains({
				permissions: ['tabs'],
			})
			const hasTabGroupsPermission = await browser.permissions.contains({
				permissions: ['tabGroups'],
			})

			if (!hasTabsPermission) {
				setLoading(false)
				return
			}

			const allTabs = await browser.tabs.query({})

			const tabsData: Tab[] = allTabs
				.filter((tab) => tab.id !== undefined)
				.map((tab) => ({
					id: tab.id as number,
					title: tab.title || 'Untitled',
					url: tab.url || '',
					favIconUrl: tab.favIconUrl,
					active: tab.active || false,
					audible: tab.audible || false,
					muted: tab.mutedInfo?.muted || false,
					windowId: tab.windowId || 0,
				}))

			setTabs(tabsData)

			// Load tab groups if supported and permission granted
			if (browser.tabGroups && hasTabGroupsPermission && !import.meta.env.FIREFOX) {
				try {
					const allGroups = await browser.tabGroups.query({})
					const groupsData: TabGroup[] = allGroups
						.filter((group) => group.id !== undefined)
						.map((group) => ({
							id: group.id as number,
							title: group.title || `Group ${group.id}`,
							color: group.color,
							tabs: tabsData.filter((tab) => {
								const tabInfo = allTabs.find((t) => t.id === tab.id)
								return tabInfo && tabInfo.groupId === group.id
							}),
						}))
						.filter((group) => group.tabs.length > 0) // Only show groups with tabs
					setGroups(groupsData)
				} catch (error) {
					console.log('Tab groups not supported', error)
				}
			}

			setLoading(false)
		} catch (error) {
			console.error('Error loading tabs:', error)
			setLoading(false)
		}
	}

	const switchToTab = async (tabId: number) => {
		try {
			await browser.tabs.update(tabId, { active: true })
			const tab = await browser.tabs.get(tabId)
			if (tab.windowId) {
				await browser.windows.update(tab.windowId, { focused: true })
			}
		} catch (error) {
			console.error('Error switching to tab:', error)
		}
	}

	const closeTab = async (tabId: number, e: React.MouseEvent) => {
		e.stopPropagation()
		try {
			await browser.tabs.remove(tabId)
		} catch (error) {
			console.error('Error closing tab:', error)
		}
	}

	const createNewTab = async () => {
		try {
			await browser.tabs.create({})
		} catch (error) {
			console.error('Error creating new tab:', error)
		}
	}

	const reloadTab = async (tabId: number, e: React.MouseEvent) => {
		e.stopPropagation()
		try {
			await browser.tabs.reload(tabId)
		} catch (error) {
			console.error('Error reloading tab:', error)
		}
	}

	const toggleMute = async (tabId: number, muted: boolean, e: React.MouseEvent) => {
		e.stopPropagation()
		try {
			await browser.tabs.update(tabId, { muted: !muted })
		} catch (error) {
			console.error('Error toggling mute:', error)
		}
	}

	return {
		tabs,
		groups,
		loading,
		hasPermission,
		requestPermissions,
		switchToTab,
		closeTab,
		createNewTab,
		reloadTab,
		toggleMute,
		refreshTabs: loadTabs,
	}
}
