import React, { useState } from 'react'
import { useFirestore } from '../../hooks/useFirestore'

// Components
import ThemePreview from './ThemePreview'
import ThemeField from './Field'
import ColorPicker from '../ColorPicker/ColorPicker'
import Field from '../Inputs/Field/Field'

// Styles && Assets
import './ThemeCreator.scss'

export default function ThemeCreator({
	setShowThemePicker,
	setShowThemeCreator,
	chat,
	editedTheme,
	setConfirmCustomTheme,
	confirmCustomTheme,
}) {
	const { updateDocument } = useFirestore('projects')

	const [name, setName] = useState(editedTheme ? editedTheme.name : '')
	const [bgDark, setBgDark] = useState({
		show: true,
		value: editedTheme ? editedTheme.colors.bgDark : '#0e0f10',
	})

	const [borderRadius, setBorderRadius] = useState({
		show: false,
		value: editedTheme ? editedTheme.borderRadius : 15,
	})
	const [curUserMessage, setCurUserMessage] = useState({
		show: false,
		bg: editedTheme
			? editedTheme.colors.msgBgOwner
			: [
					{
						id: 0,
						value: '#533e7a',
					},
					{
						id: 1,
						value: '#14545c',
					},
			  ],
		text: editedTheme ? editedTheme.colors.messageColorOwner : '#e8e8e8',
		border: editedTheme ? editedTheme.colors.msgBorderOwner : '#121212',
	})

	const [otherUserMessage, setOtherUserMessage] = useState({
		show: false,
		bg: editedTheme ? editedTheme.colors.msgBg : '#1e1e1e',
		text: editedTheme ? editedTheme.colors.messageColor : '#cacaca',
		border: editedTheme ? editedTheme.colors.msgBorder : '#1e1e1e',
	})

	const [inputColors, setInputColors] = useState({
		show: false,
		bg: editedTheme ? editedTheme.colors.inputBg : '#1e1e1e',
		text: editedTheme ? editedTheme.colors.inputText : '#c4c4c4',
		border: editedTheme ? editedTheme.colors.inputBorder : '#1e1e1e',
	})

	const [textColors, setTextColors] = useState({
		show: false,
		primary: editedTheme ? editedTheme.colors.textPrimary : '#d9d9d9',
		accent: editedTheme ? editedTheme.colors.textAccent : '#5b3ba5',
		lowContrast: editedTheme ? editedTheme.colors.textLowContrast : '#646464',
	})
	const [buttonColor, setButtonColor] = useState({
		show: false,
		value: editedTheme ? editedTheme.colors.buttonColor : '#dedede',
	})

	const updateMessageBg = (index, e) => {
		let newArr = [...curUserMessage.bg]
		newArr[index] = { value: e.target.value, id: index }
		setCurUserMessage({ ...curUserMessage, bg: newArr })
	}

	const submitCustomTheme = async () => {
		// setDoc(doc(projectFirestore, 'themes', 'green'), {
		// 	id: name,
		// 	name: name,
		// 	colors: {
		// 		bgDark: bgDark.value,
		// 		bgSecondary: bgSecondary.value,
		// 		inputBg: inputColors.bg,
		// 		inputText: inputColors.text,
		// 		textAccent: textColors.accent,
		// 		textLowContrast: textColors.lowContrast,
		// 		msgBg: otherUserMessage.bg,
		// 		messageColor: otherUserMessage.text,
		// 		msgBgOwner: curUserMessage.bg,
		// 		messageColorOwner: curUserMessage.text,
		// 	},
		// 	borderRadius: borderRadius.value,
		// })

		const themeToAdd = {
			id: `${name}`,
			name: `${name}`,
			colors: {
				bgDark: `${bgDark.value}`,
				inputBg: `${inputColors.bg}`,
				inputText: `${inputColors.text}`,
				inputBorder: `${inputColors.border}`,
				textPrimary: `${textColors.primary}`,
				textAccent: `${textColors.accent}`,
				textLowContrast: `${textColors.lowContrast}`,
				msgBg: `${otherUserMessage.bg}`,
				messageColor: `${otherUserMessage.text}`,
				msgBgOwner: curUserMessage.bg,
				messageColorOwner: `${curUserMessage.text}`,
				msgBorderOwner: `${curUserMessage.border}`,
				msgBorder: `${otherUserMessage.border}`,
				buttonColor: `${buttonColor.value}`,
			},
			borderRadius: borderRadius.value,
			isCustom: true,
		}
		if (editedTheme === null) {
			await updateDocument(chat.id, {
				customThemes: [...chat.customThemes, themeToAdd],
			})
			setConfirmCustomTheme(false)
			setShowThemeCreator(false)
		}
		if (editedTheme !== null) {
			await updateDocument(chat.id, {
				customThemes: updateCustomThemes(editedTheme, themeToAdd),
				theme: {
					isCustom: true,
					name: name,
				},
			})
			setConfirmCustomTheme(false)
			setShowThemeCreator(false)
		}
	}

	const updateCustomThemes = (editedTheme, theme) => {
		const index = chat.customThemes.indexOf(editedTheme)
		let newArr = [...chat.customThemes]

		newArr[index] = theme

		return newArr
	}

	return (
		<div className='theme-creator'>
			<form className='theme-creator__form custom-scrollbar'>
				<div className='field'>
					<p>Name your theme</p>
					<Field type='text' value={name} setValue={setName} label='Theme name' />
				</div>

				<ThemeField
					title={'Background color'}
					setShow={() => setBgDark({ ...bgDark, show: !bgDark.show })}
					show={bgDark.show}>
					<ColorPicker
						value={bgDark.value}
						setValue={e => {
							setBgDark({ ...bgDark, value: e.target.value })
						}}
					/>
				</ThemeField>

				<ThemeField
					title={'Input colors'}
					setShow={() => setInputColors({ ...inputColors, show: !inputColors.show })}
					show={inputColors.show}>
					<ColorPicker
						value={inputColors.bg}
						setValue={e => {
							setInputColors({ ...inputColors, bg: e.target.value })
						}}
						separator={'background'}
					/>
					<ColorPicker
						value={inputColors.text}
						setValue={e => {
							setInputColors({ ...inputColors, text: e.target.value })
						}}
						separator={'text'}
					/>
					<ColorPicker
						value={inputColors.border}
						setValue={e => {
							setInputColors({ ...inputColors, border: e.target.value })
						}}
						separator={'border'}
					/>
				</ThemeField>

				<ThemeField
					title={'Button color'}
					setShow={() => setButtonColor({ ...buttonColor, show: !buttonColor.show })}
					show={buttonColor.show}>
					<ColorPicker
						value={buttonColor.value}
						setValue={e => {
							setButtonColor({ ...buttonColor, value: e.target.value })
						}}
					/>
				</ThemeField>

				<ThemeField
					title={'Text colors'}
					setShow={() => setTextColors({ ...textColors, show: !textColors.show })}
					show={textColors.show}>
					<ColorPicker
						value={textColors.primary}
						setValue={e => {
							setTextColors({ ...textColors, primary: e.target.value })
						}}
						separator={'primary'}
					/>
					<ColorPicker
						value={textColors.accent}
						setValue={e => {
							setTextColors({ ...textColors, accent: e.target.value })
						}}
						separator={'accent'}
					/>
					<ColorPicker
						value={textColors.lowContrast}
						setValue={e => {
							setTextColors({ ...textColors, lowContrast: e.target.value })
						}}
						separator={'low contrast'}
					/>
				</ThemeField>

				<ThemeField
					title={'Other user messages'}
					setShow={() => setOtherUserMessage({ ...otherUserMessage, show: !otherUserMessage.show })}
					show={otherUserMessage.show}>
					<ColorPicker
						value={otherUserMessage.bg}
						setValue={e => {
							setOtherUserMessage({ ...otherUserMessage, bg: e.target.value })
						}}
						separator={'background'}
					/>
					<ColorPicker
						value={otherUserMessage.text}
						setValue={e => {
							setOtherUserMessage({ ...otherUserMessage, text: e.target.value })
						}}
						separator={'text'}
					/>
					<ColorPicker
						value={otherUserMessage.border}
						setValue={e => {
							setOtherUserMessage({ ...otherUserMessage, border: e.target.value })
						}}
						separator={'border'}
					/>
				</ThemeField>

				<ThemeField
					title={'Current user messages'}
					setShow={() => setCurUserMessage({ ...curUserMessage, show: !curUserMessage.show })}
					show={curUserMessage.show}>
					<div className='separator'>
						<span>background</span>
					</div>

					<div className='colors-list custom-scrollbar'>
						{curUserMessage.bg.map((color, index) => (
							<React.Fragment key={color.id}>
								<ColorPicker
									value={color.value}
									setValue={e => {
										updateMessageBg(index, e)
									}}>
									<i
										className='fa-solid fa-xmark remove-color'
										onClick={() =>
											setCurUserMessage({ ...curUserMessage, bg: curUserMessage.bg.filter(c => c !== color) })
										}></i>
								</ColorPicker>
							</React.Fragment>
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

					<ColorPicker
						value={curUserMessage.text}
						setValue={e => {
							setCurUserMessage({ ...curUserMessage, text: e.target.value })
						}}
						separator={'text'}
					/>

					<ColorPicker
						value={curUserMessage.border}
						setValue={e => {
							setCurUserMessage({ ...curUserMessage, border: e.target.value })
						}}
						separator={'border'}
					/>
				</ThemeField>

				<ThemeField
					title={'Border radius'}
					setShow={() => setBorderRadius({ ...borderRadius, show: !borderRadius.show })}
					show={borderRadius.show}>
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
				</ThemeField>
			</form>

			<ThemePreview
				otherUserMessage={otherUserMessage}
				curUserMessage={curUserMessage}
				bgDark={bgDark}
				borderRadius={borderRadius}
				textColors={textColors}
				inputColors={inputColors}
				confirmCustomTheme={confirmCustomTheme}
				setConfirmCustomTheme={setConfirmCustomTheme}
				submitCustomTheme={submitCustomTheme}
				editedTheme={editedTheme}
				setShowThemeCreator={setShowThemeCreator}
				setShowThemePicker={setShowThemePicker}
				name={name}
				buttonColor={buttonColor}
			/>
		</div>
	)
}
