import { useFirestore } from '../hooks/useFirestore'

// Styles
import './ThemePicker.scss'

const ThemePicker = ({ themes, chat, setShowThemeCreator }) => {
	const { updateDocument } = useFirestore('projects')

	const changeTheme = async theme => {
		try {
			await updateDocument(chat.id, {
				theme: {
					name: theme.id,
					isCustom: theme.isCustom ? theme.isCustom : false,
				},
			})
		} catch (err) {
			console.log(err)
		}
	}

	const spreadColors = theme => {
		let colors = null

		theme.colors.msgBgOwner.forEach(color => {
			colors === null ? (colors = `${color.value}`) : (colors = `${colors}, ${color.value}`)
		})

		if (theme.colors.msgBgOwner.length === 1) {
			return colors
		} else {
			return `linear-gradient(${colors})`
		}
	}

	return (
		<div className='theme-picker'>
			<div className='theme-picker__themes'>
				{themes.map(theme => (
					<div
						className='theme-picker__themes__theme'
						key={theme.id}
						style={{
							background: spreadColors(theme),
						}}
						onClick={() => {
							changeTheme(theme)
						}}></div>
				))}
			</div>

			<div className='separator'>
				<span>create your own theme</span>
			</div>

			<div className='theme-picker__themes'>
				{chat.customThemes.length > 0 &&
					chat.customThemes.map(theme => (
						<div
							key={theme.id}
							className='theme-picker__themes__theme'
							style={{
								background: spreadColors(theme),
							}}
							onClick={() => {
								changeTheme(theme)
							}}>
							{console.log(theme)}
						</div>
					))}

				<button
					className='create-theme'
					onClick={() => {
						setShowThemeCreator(true)
						// setShowThemePicker(false)
					}}>
					<i className='fa-solid fa-plus'></i>
				</button>
			</div>
		</div>
	)
}

export default ThemePicker
