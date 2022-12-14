import { useState } from 'react'
import { useFirestore } from '../hooks/useFirestore'

// Components
import Avatar from './Avatar'

// Styles && Assets
import './ThemeCreator.scss'
import britImg from '../assets/british-person.jpg'
import { setDoc, doc } from 'firebase/firestore'
import { projectFirestore } from '../firebase/config'

export default function ThemeCreator({ setShowThemePicker, setShowThemeCreator, chat }) {
	const [name, setName] = useState('')
	const [bgDark, setBgDark] = useState({
		show: true,
		value: '#121212',
	})
	const [bgSecondary, setBgSecondary] = useState({
		show: false,
		value: '#1e1e1e',
	})

	const [borderRadius, setBorderRadius] = useState({
		show: false,
		value: 8,
	})
	const [curUserMessage, setCurUserMessage] = useState({
		show: false,
		bg: [
			{
				id: '0',
				value: '#643e7a',
			},
			{
				id: '1',
				value: '#643e7a',
			},
		],
		text: '#cacaca',
	})

	const [otherUserMessage, setOtherUserMessage] = useState({
		show: false,
		bg: '#1e1e1e',
		text: '#cacaca',
	})

	const [inputColors, setInputColors] = useState({
		show: false,
		bgColor: '#1e1e1e',
		textColor: '#c4c4c4',
	})
	const [textColors, setTextColors] = useState({
		show: false,
		accent: '#643e7a',
		lowContrast: '#646464',
		midContrast: '#888888',
		heading: '#d4d4d4',
	})

	const updateMessageBg = (index, e) => {
		let newArr = [...curUserMessage.bg]

		newArr[index] = { value: e.target.value, id: index }

		setCurUserMessage({ ...curUserMessage, bg: newArr })
	}

	const spreadColors = () => {
		let colors = null

		curUserMessage.bg.forEach(color => {
			colors === null ? (colors = `${color.value}`) : (colors = `${colors}, ${color.value}`)
		})

		if (curUserMessage.bg.length === 1) {
			return colors
		} else {
			return `linear-gradient(${colors})`
		}
	}

	const { updateDocument } = useFirestore('projects')

	const submitCustomTheme = async () => {
		const themeToAdd = {
			id: name,
			name: name,
			colors: {
				bgDark: bgDark.value,
				bgSecondary: bgSecondary.value,
				inputBg: inputColors.bgColor,
				inputText: inputColors.textColor,
				textAccent: textColors.accent,
				textLowContrast: textColors.lowContrast,
				textMidContrast: textColors.midContrast,
				textHeading: textColors.heading,
				msgBg: otherUserMessage.bg,
				messageColor: otherUserMessage.text,
				msgBgOwner: curUserMessage.bg,
				messageColorOwner: curUserMessage.text,
			},
			borderRadius: borderRadius.value,
		}

		// setDoc(doc(projectFirestore, 'themes', 'bloody'), {
		// 	id: 'bloody',
		// 	name: name,
		// 	colors: {
		// 		bgDark: bgDark.value,
		// 		bgSecondary: bgSecondary.value,
		// 		inputBg: inputColors.bgColor,
		// 		inputText: inputColors.textColor,
		// 		textAccent: textColors.accent,
		// 		textLowContrast: textColors.lowContrast,
		// 		textMidContrast: textColors.midContrast,
		// 		textHeading: textColors.heading,
		// 		msgBg: otherUserMessage.bg,
		// 		messageColor: otherUserMessage.text,
		// 		msgBgOwner: curUserMessage.bg,
		// 		messageColorOwner: curUserMessage.text,
		// 	},
		// 	borderRadius: borderRadius.value,
		// })

		if (chat.customThemes.length <= 3) {
			try {
				await updateDocument(chat.id, {
					customThemes: [...chat.customThemes, themeToAdd],
				})
				setShowThemeCreator(false)
			} catch (err) {
				console.log(err)
			}
		}
	}

	return (
		<div className='theme-creator'>
			<form className='theme-creator__form custom-scrollbar'>
				<div className='part'>
					<p>Name your theme</p>

					<input type='text' placeholder='Aa' required value={name} onChange={e => setName(e.target.value)} />
				</div>

				<div className='part'>
					<p
						onClick={() => {
							setBgDark({ ...bgDark, show: !bgDark.show })
						}}>
						<i className={`fa-solid fa-angle-right ${bgDark.show ? 'active' : ''}`}></i> Background color
					</p>

					{bgDark.show && (
						<div className='color-picker'>
							<input
								type='text'
								className='color-picker__value'
								value={bgDark.value}
								onChange={e => setBgDark({ ...bgDark, value: e.target.value })}
							/>
							<input
								type='color'
								value={bgDark.value}
								onChange={e => setBgDark({ ...bgDark, value: e.target.value })}
							/>
						</div>
					)}
				</div>

				<div className='part'>
					<p
						onClick={() => {
							setBgSecondary({ ...bgSecondary, show: !bgSecondary.show })
						}}>
						<i className={`fa-solid fa-angle-right ${bgSecondary.show ? 'active' : ''}`}></i> Secondary background color
					</p>
					{bgSecondary.show && (
						<div className='color-picker'>
							<input
								type='text'
								className='color-picker__value'
								value={bgSecondary.value}
								onChange={e => setBgSecondary({ ...bgSecondary, value: e.target.value })}
							/>
							<input
								type='color'
								value={bgSecondary.value}
								onChange={e => setBgSecondary({ ...bgSecondary, value: e.target.value })}
							/>
						</div>
					)}
				</div>

				<div className='part'>
					<p
						onClick={() => {
							setInputColors({ ...inputColors, show: !inputColors.show })
						}}>
						<i className={`fa-solid fa-angle-right ${inputColors.show ? 'active' : ''}`}></i> Input colors
					</p>
					{inputColors.show && (
						<>
							<div className='separator'>
								<span>background</span>
							</div>

							<div className='color-picker'>
								<input
									type='text'
									className='color-picker__value'
									value={inputColors.bgColor}
									onChange={e => setInputColors({ ...inputColors, bgColor: e.target.value })}
								/>
								<input
									type='color'
									value={inputColors.bgColor}
									onChange={e => setInputColors({ ...inputColors, bgColor: e.target.value })}
								/>
							</div>

							<div className='separator'>
								<span>text</span>
							</div>

							<div className='color-picker'>
								<input
									type='text'
									className='color-picker__value'
									value={inputColors.textColor}
									onChange={e => setInputColors({ ...inputColors, textColor: e.target.value })}
								/>
								<input
									type='color'
									value={inputColors.textColor}
									onChange={e => setInputColors({ ...inputColors, textColor: e.target.value })}
								/>
							</div>
						</>
					)}
				</div>

				<div className='part'>
					<p
						onClick={() => {
							setTextColors({ ...textColors, show: !textColors.show })
						}}>
						<i className={`fa-solid fa-angle-right ${textColors.show ? 'active' : ''}`}></i> Text colors
					</p>

					{textColors.show && (
						<>
							<div className='separator'>
								<span>accent</span>
							</div>

							<div className='color-picker'>
								<input
									type='text'
									className='color-picker__value'
									value={textColors.accent}
									onChange={e => setTextColors({ ...textColors, accent: e.target.value })}
								/>
								<input
									type='color'
									value={textColors.accent}
									onChange={e => setTextColors({ ...textColors, accent: e.target.value })}
								/>
							</div>

							<div className='separator'>
								<span>low contrast</span>
							</div>

							<div className='color-picker'>
								<input
									type='text'
									className='color-picker__value'
									value={textColors.lowContrast}
									onChange={e => setTextColors({ ...textColors, lowContrast: e.target.value })}
								/>
								<input
									type='color'
									value={textColors.lowContrast}
									onChange={e => setTextColors({ ...textColors, lowContrast: e.target.value })}
								/>
							</div>

							<div className='separator'>
								<span>mid contrast</span>
							</div>

							<div className='color-picker'>
								<input
									type='text'
									className='color-picker__value'
									value={textColors.midContrast}
									onChange={e => setTextColors({ ...textColors, midContrast: e.target.value })}
								/>
								<input
									type='color'
									value={textColors.midContrast}
									onChange={e => setTextColors({ ...textColors, midContrast: e.target.value })}
								/>
							</div>

							<div className='separator'>
								<span>headings</span>
							</div>

							<div className='color-picker'>
								<input
									type='text'
									className='color-picker__value'
									value={textColors.heading}
									onChange={e => setTextColors({ ...textColors, heading: e.target.value })}
								/>
								<input
									type='color'
									value={textColors.heading}
									onChange={e => setTextColors({ ...textColors, heading: e.target.value })}
								/>
							</div>
						</>
					)}
				</div>

				<div className='part'>
					<p
						onClick={() => {
							setOtherUserMessage({ ...otherUserMessage, show: !otherUserMessage.show })
						}}>
						<i className={`fa-solid fa-angle-right ${otherUserMessage.show ? 'active' : ''}`}></i> Other user messages
					</p>

					{otherUserMessage.show && (
						<>
							<div className='separator'>
								<span>background</span>
							</div>

							<div className='color-picker'>
								<input
									type='text'
									className='color-picker__value'
									value={otherUserMessage.bg}
									onChange={e => setOtherUserMessage({ ...otherUserMessage, bg: e.target.value })}
								/>
								<input
									type='color'
									value={otherUserMessage.bg}
									onChange={e => setOtherUserMessage({ ...otherUserMessage, bg: e.target.value })}
								/>
							</div>

							<div className='separator'>
								<span>color</span>
							</div>

							<div className='color-picker'>
								<input
									type='text'
									className='color-picker__value'
									value={otherUserMessage.text}
									onChange={e => setOtherUserMessage({ ...otherUserMessage, text: e.target.value })}
								/>
								<input
									type='color'
									value={otherUserMessage.text}
									onChange={e => setOtherUserMessage({ ...otherUserMessage, text: e.target.value })}
								/>
							</div>
						</>
					)}
				</div>

				<div className='part message-colors'>
					<p
						onClick={() => {
							setCurUserMessage({ ...curUserMessage, show: !curUserMessage.show })
							console.log(curUserMessage)
						}}>
						<i className={`fa-solid fa-angle-right ${curUserMessage.show ? 'active' : ''}`}></i> Current user messages
					</p>

					{curUserMessage.show && (
						<>
							<div className='separator'>
								<span>background</span>
							</div>

							<div className='colors-list custom-scrollbar'>
								{curUserMessage.bg.map((color, index) => (
									<div className='color-picker' key={color.id}>
										<input
											type='text'
											className='color-picker__value'
											value={color.value}
											onChange={e => updateMessageBg(index, e)}
										/>
										<input
											type='color'
											value={color.value}
											onChange={e => {
												updateMessageBg(index, e)
											}}
										/>

										<i
											className='fa-solid fa-xmark remove-color'
											onClick={() =>
												setCurUserMessage({ ...curUserMessage, bg: curUserMessage.bg.filter(c => c !== color) })
											}></i>
									</div>
								))}
							</div>

							<div
								className='add-color'
								onClick={() =>
									setCurUserMessage({
										...curUserMessage,
										bg: [...curUserMessage.bg, { value: '#643e7a', id: Math.random(0, 100) * 100 }],
									})
								}>
								<i className='fa-solid fa-plus'></i>
								<span>add another color</span>
							</div>

							<div className='separator'>
								<span>text</span>
							</div>

							<div className='color-picker'>
								<input
									type='text'
									className='color-picker__value'
									value={curUserMessage.text}
									onChange={e => setCurUserMessage({ ...curUserMessage, text: e.target.value })}
								/>
								<input
									type='color'
									value={curUserMessage.text}
									onChange={e => setCurUserMessage({ ...curUserMessage, text: e.target.value })}
								/>
							</div>
						</>
					)}
				</div>

				<div className='part'>
					<p
						onClick={() => {
							setBorderRadius({ ...borderRadius, show: !borderRadius.show })
						}}>
						<i className={`fa-solid fa-angle-right ${borderRadius.show ? 'active' : ''}`}></i> Border radius
					</p>

					{borderRadius.show && (
						<div className='flex-row'>
							<input
								type='range'
								value={borderRadius.value}
								onChange={e => setBorderRadius({ ...borderRadius, value: e.target.value })}
								min='0'
								max='25'
							/>
							<span>{borderRadius.value}px</span>
						</div>
					)}
				</div>
			</form>

			<div className='theme-creator__preview'>
				<div
					className='chat-preview'
					style={{ backgroundColor: bgDark.value, borderRadius: `${borderRadius.value}px` }}>
					<div className='chat-preview__top-bar'>
						<div className='chat-preview__top-bar__user'>
							<Avatar src={britImg} />
							<span style={{ color: textColors.heading }}>John Doe</span>
						</div>

						<i className='fa-solid fa-ellipsis-vertical' style={{ color: textColors.accent }}></i>
					</div>
					<div className='chat-preview__messages'>
						<div
							className='message owner'
							style={{
								backgroundImage: `${spreadColors()}`,
								backgroundAttachment: 'fixed',
								backgroundSize: 'auto 35%',
								backgroundPosition: 'center 100%',
								borderRadius: '25px 25px 5px 25px',
								color: curUserMessage.text,
							}}>
							Hello mate
						</div>
						<div
							className='message owner'
							style={{
								backgroundImage: `${spreadColors()}`,
								backgroundAttachment: 'fixed',
								backgroundSize: 'auto 35%',
								backgroundPosition: 'center 100%',
								borderRadius: '25px 5px 25px 25px',
								color: curUserMessage.text,
							}}>
							it's tuesday init?
						</div>

						<div className='centered' style={{ color: textColors.lowContrast }}>
							Set quick emoji to ☕
						</div>

						<div
							className='message'
							style={{
								backgroundColor: otherUserMessage.bg,
								borderRadius: '25px 25px 25px 5px',
								color: otherUserMessage.text,
							}}>
							oh yes yes
						</div>

						<div
							className='message'
							style={{
								backgroundColor: otherUserMessage.bg,
								borderRadius: '5px 25px 25px 5px',
								color: otherUserMessage.text,
							}}>
							what a lovely weather we have today
						</div>

						<div
							className='message'
							style={{
								backgroundColor: otherUserMessage.bg,
								borderRadius: '5px 25px 25px 25px',
								color: otherUserMessage.text,
							}}>
							🌞
						</div>

						<br />

						<div
							className='message owner'
							style={{
								backgroundImage: `${spreadColors()}`,
								backgroundAttachment: 'fixed',
								backgroundSize: 'auto 35%',
								backgroundPosition: 'center 100%',
								borderRadius: '25px',
								color: curUserMessage.text,
							}}>
							*sips tea 🍵*
						</div>
					</div>
					<div className='flex-row'>
						<i className='fa-regular fa-image' style={{ color: textColors.accent }}></i>
						<div
							className='chat-preview__input'
							style={{ backgroundColor: inputColors.bgColor, color: inputColors.textColor }}>
							<span>I love tea 😍</span>

							<i className='fa-regular fa-face-smile' style={{ color: textColors.accent }}></i>
						</div>
						<div className='chat-preview__quick-emoji'>☕</div>
					</div>
				</div>
				{/* //!! Make color picker and ".part" component */}
				<div className='flex-row'>
					<button
						className='btn btn--secondary'
						onClick={() => {
							setShowThemeCreator(false)
							setShowThemePicker(true)
						}}>
						cancel
					</button>

					{name.length > 0 && (
						<button
							type='submit'
							className='btn'
							onClick={() => {
								submitCustomTheme()
							}}>
							finish
						</button>
					)}

					{name.length <= 0 && (
						<button className='btn' disabled>
							finish
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
