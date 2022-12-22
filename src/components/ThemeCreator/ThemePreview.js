// Components
import Avatar from '../Avatar/Avatar'

// Styles && Assets
import britImg from '../../assets/british-person.jpg'
import Modal from '../Modal/Modal'

const ThemePreview = ({
	otherUserMessage,
	curUserMessage,
	bgDark,
	borderRadius,
	textColors,
	inputColors,
	confirmCustomTheme,
	setConfirmCustomTheme,
	submitCustomTheme,
	editedTheme,
	setShowThemePicker,
	setShowThemeCreator,
	buttonColor,
	name,
}) => {
	const spreadColors = () => {
		let colors = null

		curUserMessage.bg.forEach(color => {
			colors === null ? (colors = `${color.value}`) : (colors = `${colors}, ${color.value}`)
		})

		if (curUserMessage.bg.length === 1) {
			return `linear-gradient(${colors}, ${colors})`
		} else {
			return `linear-gradient(${colors})`
		}
	}

	const messageStyles = {
		backgroundColor: otherUserMessage.bg,
		color: otherUserMessage.text,
		border: `1px solid ${otherUserMessage.border}`,
	}

	const messageOwnerStyles = {
		backgroundImage: `${spreadColors()}`,
		backgroundAttachment: 'fixed',
		backgroundPosition: 'center 100%',
		backgroundSize: 'auto 35%',
		borderRadius: '25px',
		border: `1px solid ${curUserMessage.border}`,
		color: curUserMessage.text,
	}

	return (
		<div className='theme-creator__preview'>
			<div className='chat-preview' style={{ backgroundColor: bgDark.value, borderRadius: `${borderRadius.value}px` }}>
				<div className='chat-preview__top-bar'>
					<div className='chat-preview__top-bar__user'>
						<Avatar src={britImg} />
						<span style={{ color: textColors.primary }}>John Doe</span>
					</div>

					<i className='fa-solid fa-ellipsis-vertical' style={{ color: textColors.accent }}></i>
				</div>
				<div className='chat-preview__messages'>
					<div className='message owner' style={{ ...messageOwnerStyles, borderRadius: '25px 25px 5px 25px' }}>
						Hello mate
					</div>
					<div className='message owner' style={{ ...messageOwnerStyles, borderRadius: '25px 5px 25px 25px' }}>
						it's tuesday init?
					</div>

					<div className='centered' style={{ color: textColors.lowContrast }}>
						Set quick emoji to ☕
					</div>

					<div className='message' style={{ ...messageStyles, borderRadius: '25px 25px 25px 5px' }}>
						oh yes yes
					</div>

					<div className='message' style={{ ...messageStyles, borderRadius: '5px 25px 25px 5px' }}>
						what a lovely weather we have today
					</div>

					<div className='message' style={{ ...messageStyles, borderRadius: '5px 25px 25px 25px' }}>
						🌞
					</div>

					<br />

					<div className='message owner' style={{ ...messageOwnerStyles, borderRadius: '25px 25px 25px 25px' }}>
						*sips tea 🍵*
					</div>
				</div>
				<div className='flex-row'>
					<i className='fa-regular fa-image' style={{ color: textColors.accent }}></i>
					<div
						className='chat-preview__input'
						style={{
							backgroundColor: inputColors.bg,
							color: inputColors.text,
							border: `1px solid ${inputColors.border}`,
						}}>
						<span>I love tea 😍</span>

						<i className='fa-regular fa-face-smile' style={{ color: textColors.accent }}></i>
					</div>
					<div className='chat-preview__quick-emoji'>☕</div>
				</div>
			</div>

			<Modal show={confirmCustomTheme} setShow={() => setConfirmCustomTheme(false)}>
				<h3>Are you sure you want to proceed?</h3>
				<div className='btn-group'>
					<div className='btn btn--secondary' onClick={() => setConfirmCustomTheme(false)}>
						go back
					</div>
					<div className='btn' onClick={() => submitCustomTheme()}>
						{editedTheme !== null ? 'edit' : 'create'} theme
					</div>
				</div>
			</Modal>

			<div className='btn-group'>
				<button
					className='btn btn--secondary'
					onClick={() => {
						setShowThemeCreator(false)
						setShowThemePicker(true)
					}}
					style={{
						color: textColors.accent,
						border: `1px solid ${textColors.accent}`,
						borderRadius: `${borderRadius.value}px`,
					}}>
					cancel
				</button>

				{name.length > 0 && (
					<button
						type='submit'
						className='btn'
						onClick={() => {
							setConfirmCustomTheme(true)
						}}
						style={{
							color: buttonColor.value,
							borderRadius: `${borderRadius.value}px`,
							border: `1px solid ${textColors.accent}`,
							backgroundColor: textColors.accent,
						}}>
						{editedTheme !== null ? 'edit' : 'create'}
					</button>
				)}

				{name.length <= 0 && (
					<button
						className='btn'
						disabled
						style={{
							color: buttonColor.value,
							borderRadius: `${borderRadius.value}px`,
							border: `1px solid ${textColors.accent}`,
							backgroundColor: textColors.accent,
						}}>
						{editedTheme !== null ? 'edit' : 'create'}
					</button>
				)}
			</div>
		</div>
	)
}

export default ThemePreview
