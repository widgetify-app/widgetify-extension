import { useEffect, useMemo, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { EmptyState, Spinner, TextInput } from '@/components/ui'
import { getFaviconFromUrl } from '@/features/widgets/utils/icon'
import { getBrowserBookmarkTree } from '@/features/widgets/utils/browser-bookmarks'
import { Icon } from '@/icons'
import {
	type BookmarkNode,
	folderPath,
	hostOf,
	openFolder,
	searchBookmarks,
	subfolders,
	topFolders,
} from '../../utils/bookmark-tree'

interface BookmarkPanelProps {
	folderId: string | null
	onFolderChange: (id: string) => void
}

export function BookmarkPanel({ folderId, onFolderChange }: BookmarkPanelProps) {
	const [roots, setRoots] = useState<BookmarkNode[] | null>(null)
	const [query, setQuery] = useState('')
	const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
	const searchSent = useRef(false)

	useEffect(() => {
		let cancelled = false
		getBrowserBookmarkTree().then((tree) => {
			if (!cancelled) setRoots(tree)
		})
		return () => {
			cancelled = true
		}
	}, [])

	const folders = useMemo(() => (roots ? topFolders(roots) : []), [roots])
	const current = openFolder(folders, folderId)
	const path = folderPath(folders, current?.id ?? null)
	const results = useMemo(() => searchBookmarks(folders, query), [folders, query])
	const isSearching = query.trim().length > 0

	const changeQuery = (value: string) => {
		setQuery(value)
		if (value.trim() && !searchSent.current) {
			searchSent.current = true
			Analytics.event('browser_bookmark_searched')
		}
	}

	const selectFolder = (folder: BookmarkNode) => {
		if (folder.id === current?.id) {
			setCollapsed((prev) => {
				const next = new Set(prev)
				if (next.has(folder.id)) next.delete(folder.id)
				else next.add(folder.id)
				return next
			})
			return
		}
		setCollapsed((prev) => {
			const next = new Set(prev)
			next.delete(folder.id)
			return next
		})
		setQuery('')
		onFolderChange(folder.id)
		Analytics.event('browser_bookmark_folder_opened')
	}

	const renderTree = (nodes: BookmarkNode[], depth: number) => (
		<ul className="flex flex-col gap-0.5">
			{nodes.map((node) => {
				const children = subfolders(node)
				const isOpen =
					children.length > 0 &&
					!collapsed.has(node.id) &&
					path.some((step) => step.id === node.id)
				const isCurrent = node.id === current?.id && !isSearching
				return (
					<li key={node.id}>
						<button
							type="button"
							onClick={() => selectFolder(node)}
							aria-current={isCurrent ? 'true' : undefined}
							aria-expanded={children.length ? isOpen : undefined}
							style={{ paddingInlineStart: `${8 + depth * 14}px` }}
							className={cn(
								'flex items-center w-full gap-1.5 py-1.5 pe-2 text-xs rounded-lg cursor-pointer transition-ui focus-visible:focus-ring',
								isCurrent
									? 'bg-brand-fill text-brand font-bold'
									: 'text-fg hover:bg-fill-2'
							)}
						>
							<span className="grid w-3 shrink-0 place-items-center text-fg-faint">
								{children.length > 0 && (
									<Icon
										name={isOpen ? 'chevronDown' : 'chevronLeft'}
										size={12}
									/>
								)}
							</span>
							<Icon
								name="folder"
								size={16}
								className="shrink-0 text-brand"
							/>
							<span className="truncate">{node.title}</span>
						</button>
						{isOpen && renderTree(children, depth + 1)}
					</li>
				)
			})}
		</ul>
	)

	const openSite = () => Analytics.event('browser_bookmark_clicked')

	return (
		<div className="flex flex-col h-85">
			<div className="p-2.5 border-b border-surface-3">
				<div className="flex items-center gap-2 px-3 h-9 rounded-xl bg-fill text-fg-faint focus-within:ring-2 focus-within:ring-brand-fill-2">
					<Icon name="search" size={16} />
					<TextInput
						variant="bare"
						size="sm"
						value={query}
						onChange={changeQuery}
						placeholder={t('widgets.search.bookmark.search')}
						aria-label={t('widgets.search.bookmark.search')}
						className="flex-1 text-fg"
					/>
				</div>
			</div>

			{!roots ? (
				<div className="grid flex-1 place-items-center">
					<Spinner size="md" />
				</div>
			) : (
				<div className="flex flex-1 min-h-0">
					<nav
						aria-label={t('widgets.search.bookmark.folders')}
						className="w-48 p-2 overflow-y-auto border-e shrink-0 border-surface-3 bg-fill"
					>
						{renderTree(folders, 0)}
					</nav>

					<div className="flex flex-col flex-1 min-w-0 gap-2.5 p-3 overflow-y-auto">
						{isSearching ? (
							<SearchResults results={results} onOpen={openSite} />
						) : (
							<>
								<nav
									aria-label={t('widgets.search.bookmark.path')}
									className="flex flex-wrap items-center gap-1 text-xs text-fg-muted"
								>
									{path.map((step, index) =>
										index === path.length - 1 ? (
											<span
												key={step.id}
												className="font-bold text-fg-strong"
											>
												{step.title}
											</span>
										) : (
											<span
												key={step.id}
												className="flex items-center gap-1"
											>
												<button
													type="button"
													onClick={() => selectFolder(step)}
													className="cursor-pointer hover:text-fg focus-visible:focus-ring rounded-sm"
												>
													{step.title}
												</button>
												<Icon name="chevronLeft" size={12} />
											</span>
										)
									)}
								</nav>
								<FolderContents
									folder={current}
									onOpenFolder={selectFolder}
									onOpenSite={openSite}
								/>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

function FolderContents({
	folder,
	onOpenFolder,
	onOpenSite,
}: {
	folder: BookmarkNode | null
	onOpenFolder: (folder: BookmarkNode) => void
	onOpenSite: () => void
}) {
	const items = folder?.children ?? []
	if (!items.length) {
		return (
			<EmptyState
				icon="folder"
				title={t('widgets.search.bookmark.empty')}
				description={t('widgets.search.bookmark.emptyHint')}
				className="flex-1 py-6"
			/>
		)
	}

	const tile =
		'flex flex-col items-center gap-1.5 px-1.5 py-3 border rounded-xl border-surface-3 bg-surface-2 text-xs text-fg-strong transition-ui hover:border-brand-muted focus-visible:focus-ring'

	return (
		<ul className="grid grid-cols-4 gap-2">
			{items.map((item) => (
				<li key={item.id} className="min-w-0">
					{item.type === 'FOLDER' ? (
						<button
							type="button"
							onClick={() => onOpenFolder(item)}
							className={cn(tile, 'w-full cursor-pointer')}
						>
							<Icon name="folder" size={24} className="text-brand" />
							<span className="w-full text-center truncate">
								{item.title}
							</span>
						</button>
					) : (
						<a
							href={item.url ?? '#'}
							target="_blank"
							rel="noreferrer"
							onClick={onOpenSite}
							className={tile}
						>
							<img
								src={getFaviconFromUrl(item.url ?? '')}
								alt=""
								loading="lazy"
								className="w-6 h-6 rounded-lg"
							/>
							<span className="w-full text-center truncate">
								{item.title || hostOf(item.url)}
							</span>
						</a>
					)}
				</li>
			))}
		</ul>
	)
}

function SearchResults({
	results,
	onOpen,
}: {
	results: ReturnType<typeof searchBookmarks>
	onOpen: () => void
}) {
	if (!results.length) {
		return (
			<EmptyState
				icon="search"
				title={t('widgets.search.bookmark.noResults')}
				className="flex-1 py-6"
			/>
		)
	}

	return (
		<>
			<p className="text-xs text-fg-muted">
				{t('widgets.search.bookmark.results', {
					p0: new Intl.NumberFormat('fa-IR').format(results.length),
				})}
			</p>
			<ul className="flex flex-col gap-0.5">
				{results.map(({ bookmark, path }) => (
					<li key={bookmark.id}>
						<a
							href={bookmark.url ?? '#'}
							target="_blank"
							rel="noreferrer"
							onClick={onOpen}
							className="flex items-center gap-2.5 p-2 rounded-xl transition-ui hover:bg-fill-2 focus-visible:focus-ring"
						>
							<img
								src={getFaviconFromUrl(bookmark.url ?? '')}
								alt=""
								loading="lazy"
								className="w-4 h-4 rounded-sm shrink-0"
							/>
							<span className="flex flex-col flex-1 min-w-0">
								<span className="text-xs truncate text-fg-strong">
									{bookmark.title || hostOf(bookmark.url)}
								</span>
								<span className="truncate text-2xs text-fg-faint">
									{path.map((step) => step.title).join(' › ')}
								</span>
							</span>
							<span dir="ltr" className="text-2xs text-fg-faint shrink-0">
								{hostOf(bookmark.url)}
							</span>
						</a>
					</li>
				))}
			</ul>
		</>
	)
}
