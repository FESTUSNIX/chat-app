import { useFirestore } from '../../hooks/useFirestore'
import Modal from '../Modal/Modal'

// Styles
import './ThemePicker.scss'

const ThemePicker = ({
	themes,
	chat,
	setShowThemeCreator,
	setEditedTheme,
	setConfirmThemeDelete,
	confirmThemeDelete,
}) => {
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
			return `linear-gradient(${colors}, ${colors})`
		} else {
			return `linear-gradient(${colors})`
		}
	}

	const removeCustomTheme = async theme => {
		try {
			if (chat.theme && chat.theme.name === theme.id) {
				changeTheme({ id: 'frosty', isCustom: false })
			}
			await updateDocument(chat.id, {
				customThemes: [...chat.customThemes.filter(t => t !== theme)],
			})
			setConfirmThemeDelete(null)
		} catch (err) {
			console.log(err)
		}
	}

	const editCustomTheme = theme => {
		setShowThemeCreator(true)
		setEditedTheme(theme)
	}

	return (
		<div className='theme-picker'>
			<div className='theme-picker__themes'>
				{themes &&
					chat &&
					themes.map(theme => (
						<div
							className={`theme-picker__themes__theme ${
								chat.theme && theme.id === chat.theme.name && !theme.isCustom ? 'current' : ''
							}`}
							key={theme.id}
							onClick={() => {
								changeTheme(theme)
							}}>
							<i
								className='fa-solid fa-check theme-tick'
								style={{
									backgroundImage: spreadColors(theme),
								}}></i>

							<div className='theme-bg' style={{ background: spreadColors(theme) }}></div>
						</div>
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
							className={`theme-picker__themes__theme ${
								chat.theme && theme.id === chat.theme.name && theme.isCustom === chat.theme.isCustom ? 'current' : ''
							}`}
							onClick={() => {
								changeTheme(theme)
							}}>
							<i
								className='fa-solid fa-check theme-tick'
								style={{
									backgroundImage: `${spreadColors(theme)}`,
								}}></i>
							<div
								className='theme-bg'
								style={{
									background: spreadColors(theme),
								}}>
								<div className='theme-tools'>
									<div
										className='theme-tools__edit'
										onClick={e => {
											e.stopPropagation()
											editCustomTheme(theme)
										}}>
										<i className='fa-solid fa-pen'></i>
									</div>
									<div
										className='theme-tools__remove'
										onClick={e => {
											e.stopPropagation()
											// removeCustomTheme(theme)
											setConfirmThemeDelete(theme)
										}}>
										<i className='fa-solid fa-trash-can'></i>
									</div>
								</div>
							</div>
						</div>
					))}

				{chat.customThemes.length < 3 && (
					<button
						className='create-theme'
						onClick={() => {
							setShowThemeCreator(true)
							// setShowThemePicker(false)
						}}>
						<i className='fa-solid fa-plus'></i>
					</button>
				)}

				<Modal show={confirmThemeDelete !== null} setShow={() => setConfirmThemeDelete(null)}>
					<h3>Are you sure you want to proceed?</h3>
					<div className='btn-group'>
						<div className='btn btn--50 btn--secondary' onClick={() => setConfirmThemeDelete(null)}>
							go back
						</div>
						<div className='btn btn--50' onClick={() => removeCustomTheme(confirmThemeDelete)}>
							delete theme
						</div>
					</div>
				</Modal>
			</div>
		</div>
	)
}

export default ThemePicker
