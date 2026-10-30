import { describe, expect, it } from 'bun:test'
import {
	type BookmarkNode,
	folderPath,
	hostOf,
	openFolder,
	searchBookmarks,
	subfolders,
	topFolders,
} from '../utils/bookmark-tree'

const site = (id: string, title: string, url: string): BookmarkNode => ({
	id,
	title,
	url,
	type: 'BOOKMARK',
})

const folder = (id: string, title: string, children: BookmarkNode[]): BookmarkNode => ({
	id,
	title,
	url: null,
	type: 'FOLDER',
	children,
})

const work = folder('10', 'Work', [
	site('11', 'GitHub', 'https://github.com/'),
	folder('12', 'Design', [site('13', 'Figma', 'https://www.figma.com/files')]),
])
const bar = folder('1', 'Bookmarks bar', [
	work,
	site('2', 'Gmail', 'https://mail.google.com/'),
])
const other = folder('3', 'Other bookmarks', [])
const tree = [folder('0', '', [bar, other])]

describe('topFolders', () => {
	it('unwraps the browser root into its folders', () => {
		expect(topFolders(tree).map((node) => node.id)).toEqual(['1', '3'])
	})

	it('keeps several roots as they are', () => {
		expect(topFolders([bar, other]).map((node) => node.id)).toEqual(['1', '3'])
	})
})

describe('folderPath', () => {
	it('lists the folders from the top down to the one asked for', () => {
		expect(folderPath([bar, other], '12').map((node) => node.id)).toEqual([
			'1',
			'10',
			'12',
		])
	})

	it('returns nothing for a missing or empty id', () => {
		expect(folderPath([bar, other], 'gone')).toEqual([])
		expect(folderPath([bar, other], null)).toEqual([])
	})
})

describe('openFolder', () => {
	it('opens the folder asked for, or the first top folder', () => {
		expect(openFolder([bar, other], '10')?.id).toBe('10')
		expect(openFolder([bar, other], 'gone')?.id).toBe('1')
		expect(openFolder([], null)).toBeNull()
	})
})

describe('subfolders', () => {
	it('keeps only folders, in the browser order', () => {
		expect(subfolders(bar).map((node) => node.id)).toEqual(['10'])
	})
})

describe('searchBookmarks', () => {
	it('matches titles and addresses in every folder, with the path to each', () => {
		const results = searchBookmarks([bar, other], 'fig')
		expect(results.map((r) => r.bookmark.id)).toEqual(['13'])
		expect(results[0].path.map((node) => node.id)).toEqual(['1', '10', '12'])
		expect(
			searchBookmarks([bar, other], 'MAIL.google').map((r) => r.bookmark.id)
		).toEqual(['2'])
	})

	it('returns nothing for a blank query and stops at the limit', () => {
		expect(searchBookmarks([bar, other], '  ')).toEqual([])
		expect(searchBookmarks([bar, other], 'https', 2)).toHaveLength(2)
	})
})

describe('hostOf', () => {
	it('shows the host without www, and nothing for a bad address', () => {
		expect(hostOf('https://www.figma.com/files')).toBe('figma.com')
		expect(hostOf('not a url')).toBe('')
		expect(hostOf(null)).toBe('')
	})
})
