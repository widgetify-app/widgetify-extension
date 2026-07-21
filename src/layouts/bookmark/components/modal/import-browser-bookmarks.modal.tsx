import { useEffect, useMemo, useState } from 'react'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/src/icons'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { useBookmarkStore } from '../../context/bookmark.context'
import type { BrowserImportNode } from '../../types/bookmark.types'
import {
	type FetchedBrowserBookmark,
	getBrowserBookmarks,
} from '../../utils/browser-bookmarks.util'

interface ImportBrowserBookmarksModalProps {
	isOpen: boolean
	onClose: () => void
	parentId: string | null
	onImported?: () => void
}

function collectDescendantIds(node: FetchedBrowserBookmark, acc: Set<string>) {
	acc.add(node.id)
	node.children?.forEach((child) => collectDescendantIds(child, acc))
}

function buildImportNodes(
	nodes: FetchedBrowserBookmark[],
	selectedIds: Set<string>
): BrowserImportNode[] {
	const result: BrowserImportNode[] = []

	for (const node of nodes) {
		if (selectedIds.has(node.id)) {
			if (node.type === 'FOLDER') {
				result.push({
					title: node.title || 'پوشه بدون عنوان',
					type: 'FOLDER',
					url: null,
					children: node.children
						? buildImportNodes(node.children, selectedIds)
						: [],
				})
			} else if (node.url) {
				result.push({
					title: node.title || node.url,
					type: 'BOOKMARK',
					url: node.url,
				})
			}
		} else if (node.children?.length) {
			result.push(...buildImportNodes(node.children, selectedIds))
		}
	}

	return result
}

function countSelectedBookmarks(
	nodes: FetchedBrowserBookmark[],
	selectedIds: Set<string>
): number {
	let count = 0
	for (const node of nodes) {
		if (selectedIds.has(node.id) && node.type === 'BOOKMARK') count++
		if (node.children?.length)
			count += countSelectedBookmarks(node.children, selectedIds)
	}
	return count
}

interface TreeNodeProps {
	node: FetchedBrowserBookmark
	depth: number
	selectedIds: Set<string>
	expandedIds: Set<string>
	onToggleSelect: (node: FetchedBrowserBookmark) => void
	onToggleExpand: (id: string) => void
}

function TreeNode({
	node,
	depth,
	selectedIds,
	expandedIds,
	onToggleSelect,
	onToggleExpand,
}: TreeNodeProps) {
	const isFolder = node.type === 'FOLDER'
	const isExpanded = expandedIds.has(node.id)
	const isChecked = selectedIds.has(node.id)

	const descendantIds = useMemo(() => {
		const acc = new Set<string>()
		if (isFolder) collectDescendantIds(node, acc)
		acc.delete(node.id)
		return acc
	}, [node, isFolder])

	const selectedDescendantsCount = isFolder
		? [...descendantIds].filter((id) => selectedIds.has(id)).length
		: 0
	const isIndeterminate =
		isFolder &&
		!isChecked &&
		selectedDescendantsCount > 0 &&
		selectedDescendantsCount < descendantIds.size

	return (
		<div>
			<div
				className="flex items-center gap-2 py-1.5 px-1.5 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors"
				style={{ paddingRight: depth * 16 }}
				onClick={() => onToggleSelect(node)}
			>
				{isFolder ? (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							onToggleExpand(node.id)
						}}
						className="flex items-center justify-center w-4 h-4 shrink-0 text-muted"
					>
						<Icon
							name="chevronLeft"
							size={12}
							className={`transition-transform duration-150 ${
								isExpanded ? '-rotate-90' : ''
							}`}
						/>
					</button>
				) : (
					<span className="w-4 h-4 shrink-0" />
				)}

				<span
					className={`flex items-center justify-center w-4 h-4 rounded-md border shrink-0 transition-colors ${
						isChecked
							? 'bg-primary border-primary'
							: isIndeterminate
								? 'bg-primary/30 border-primary'
								: 'border-base-content/20'
					}`}
				>
					{(isChecked || isIndeterminate) && (
						<Icon name="check" size={9} className="text-white" />
					)}
				</span>

				{isFolder ? (
					<Icon name="folder" size={15} className="text-primary/80 shrink-0" />
				) : (
					<img
						src={getFaviconFromUrl(node.url || '')}
						className="w-3.5 h-3.5 rounded-sm shrink-0"
						alt=""
					/>
				)}

				<span className="flex-1 text-xs font-medium truncate">
					{node.title || 'بدون عنوان'}
				</span>
			</div>

			{isFolder && isExpanded && node.children && node.children.length > 0 && (
				<div>
					{node.children.map((child) => (
						<TreeNode
							key={child.id}
							node={child}
							depth={depth + 1}
							selectedIds={selectedIds}
							expandedIds={expandedIds}
							onToggleSelect={onToggleSelect}
							onToggleExpand={onToggleExpand}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export function ImportBrowserBookmarksModal({
	isOpen,
	onClose,
	parentId,
	onImported,
}: ImportBrowserBookmarksModalProps) {
	const { browserBookmarksEnabled, setBrowserBookmarksEnabled } = useGeneralSetting()
	const { importBrowserBookmarks } = useBookmarkStore()

	const [rootNodes, setRootNodes] = useState<FetchedBrowserBookmark[]>([])
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
	const [isLoadingTree, setIsLoadingTree] = useState(false)
	const [isImporting, setIsImporting] = useState(false)
	const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)

	useEffect(() => {
		if (!isOpen) return

		setSelectedIds(new Set())
		setProgress(null)
	}, [isOpen])

	useEffect(() => {
		if (!isOpen || !browserBookmarksEnabled) return

		let cancelled = false
		async function fetchTree() {
			setIsLoadingTree(true)
			const tree = await getBrowserBookmarks({ asTree: true })
			if (cancelled) return

			const initialNodes = tree[0]?.children?.length ? tree[0].children : tree
			setRootNodes(initialNodes)
			setExpandedIds(new Set(initialNodes.map((n) => n.id)))
			setIsLoadingTree(false)
		}
		fetchTree()

		return () => {
			cancelled = true
		}
	}, [isOpen, browserBookmarksEnabled])

	const handlePermission = () => {
		Analytics.event('browser_bookmark_import_permission_clicked')
		setBrowserBookmarksEnabled(true)
	}

	const handleToggleExpand = (id: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	const handleToggleSelect = (node: FetchedBrowserBookmark) => {
		setSelectedIds((prev) => {
			const next = new Set(prev)
			const ids = new Set<string>()
			collectDescendantIds(node, ids)

			const shouldSelect = !next.has(node.id)
			if (shouldSelect) {
				ids.forEach((id) => next.add(id))
			} else {
				ids.forEach((id) => next.delete(id))
			}
			return next
		})
	}

	const selectedBookmarkCount = useMemo(
		() => countSelectedBookmarks(rootNodes, selectedIds),
		[rootNodes, selectedIds]
	)

	const handleImport = async () => {
		const importNodes = buildImportNodes(rootNodes, selectedIds)
		if (importNodes.length === 0) {
			showToast('حداقل یک بوکمارک را انتخاب کنید.', 'error')
			return
		}

		setIsImporting(true)
		setProgress({ done: 0, total: 0 })

		const { successCount, failCount } = await importBrowserBookmarks(
			importNodes,
			parentId,
			(done, total) => setProgress({ done, total })
		)

		setIsImporting(false)

		if (successCount > 0) {
			showToast(
				failCount > 0
					? `${successCount} مورد درون‌ریزی شد، ${failCount} مورد ناموفق بود.`
					: `${successCount} مورد با موفقیت درون‌ریزی شد.`,
				failCount > 0 ? 'warning' : 'success'
			)
			onImported?.()
			onClose()
		} else {
			showToast('درون‌ریزی بوکمارک‌ها ناموفق بود.', 'error')
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			title="درون‌ریزی از بوکمارک‌های مرورگر"
			direction="rtl"
			className="overflow-y-hidden!"
			closeOnBackdropClick={!isImporting}
		>
			{!browserBookmarksEnabled ? (
				<div className="flex flex-col items-center justify-center h-64 px-4 text-center">
					<div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-primary/10">
						<Icon name="lock" className="text-primary" size={20} />
					</div>
					<p className="mb-1 text-sm font-bold">دسترسی به بوکمارک‌ها</p>
					<p className="mb-4 text-xs leading-relaxed text-muted">
						برای درون‌ریزی بوکمارک‌های مرورگر، نیاز به دسترسی شما داریم.
					</p>
					<Button
						size="sm"
						onClick={handlePermission}
						className="rounded-2xl"
						isPrimary
					>
						فعال‌سازی دسترسی
					</Button>
				</div>
			) : (
				<div className="flex flex-col justify-between h-96">
					<div className="flex items-center justify-between mb-2 shrink-0">
						<span className="text-xs text-muted">
							{selectedBookmarkCount > 0
								? `${selectedBookmarkCount} بوکمارک انتخاب شده`
								: 'موردی انتخاب نشده'}
						</span>
					</div>

					<div className="flex-1 p-1 overflow-y-auto border rounded-xl border-base-content/5 custom-scrollbar">
						{isLoadingTree ? (
							<div className="flex items-center justify-center h-full">
								<Icon
									name="spinner"
									className="animate-spin text-muted"
									size={20}
								/>
							</div>
						) : rootNodes.length > 0 ? (
							rootNodes.map((node) => (
								<TreeNode
									key={node.id}
									node={node}
									depth={0}
									selectedIds={selectedIds}
									expandedIds={expandedIds}
									onToggleSelect={handleToggleSelect}
									onToggleExpand={handleToggleExpand}
								/>
							))
						) : (
							<div className="py-8 text-xs text-center text-muted">
								بوکمارکی در مرورگر شما یافت نشد.
							</div>
						)}
					</div>

					<div className="flex items-center justify-between mt-3 gap-x-2 shrink-0">
						<Button
							onClick={onClose}
							size="md"
							disabled={isImporting}
							className="btn btn-circle bg-base-300! hover:bg-error/10! text-muted hover:text-error! px-8 border-none shadow-none rounded-xl transition-colors duration-300 ease-in-out"
						>
							انصراف
						</Button>
						<Button
							onClick={handleImport}
							size="md"
							isPrimary
							disabled={selectedBookmarkCount === 0 || isImporting}
							loading={isImporting}
							loadingText={
								<span className="text-xs">
									{progress && progress.total > 0
										? `در حال درون‌ریزی... (${progress.done}/${progress.total})`
										: 'در حال آماده‌سازی...'}
								</span>
							}
							className="btn btn-circle w-fit! px-8 border-none shadow-none text-secondary rounded-xl transition-colors duration-300 ease-in-out"
						>
							درون‌ریزی
						</Button>
					</div>
				</div>
			)}
		</Modal>
	)
}
