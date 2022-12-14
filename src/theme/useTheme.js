import { useEffect, useState } from 'react'
import { useDocument } from '../hooks/useDocument'

export const useTheme = chat => {
	const { document: themes } = useDocument('themes', 'data')

	const [theme, setTheme] = useState(themes)
	const [themeLoaded, setThemeLoaded] = useState(false)

	useEffect(() => {
		if (chat) {
			chat.theme ? setTheme(chat.theme) : setTheme(themes.default)
			// setTheme(themes)
			setThemeLoaded(true)
		}
	}, [themes, chat])

	const setMode = mode => {
		setTheme(mode)
	}

	return { theme, themeLoaded, setMode }
}
