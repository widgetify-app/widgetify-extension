import Unimport from 'unimport/unplugin'

export const autoImports = Unimport.vite({
	presets: [],
	imports: [
		{ name: 'useCallback', from: 'react' },
		{ name: 'useContext', from: 'react' },
		{ name: 'useEffect', from: 'react' },
		{ name: 'useMemo', from: 'react' },
		{ name: 'useReducer', from: 'react' },
		{ name: 'useRef', from: 'react' },
		{ name: 'useState', from: 'react' },
		{ name: 'storage', from: 'wxt/utils/storage' },
	],
	dts: false,
})
