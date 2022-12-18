import { useEffect, useState } from 'react'
import { useFirestore } from '../hooks/useFirestore'
import { timestamp } from '../firebase/config'
import { useCollection } from '../hooks/useCollection'
import { v4 as uuid } from 'uuid'

// Components
import OutsideClickHandler from 'react-outside-click-handler'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import Modal from './Modal'
import Avatar from './Avatar'
import ThemeCreator from './ThemeCreator/ThemeCreator'
import ThemePicker from './ThemePicker/ThemePicker'

// Styles && Assets
import './ChatOptions.scss'
import { useDocument } from '../hooks/useDocument'

export default function ChatOptions({ onMessageResponse, otherUser, chat, currentTheme }) {
	const uniqueId = uuid()

	const { updateDocument, response } = useFirestore('projects')
	const { documents: themes } = useCollection('themes')
	const { document: defaultThemeDoc } = useDocument('themes', 'frosty')

	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [showNicknameModal, setShowNicknameModal] = useState(false)
	const [showNicknameInput, setShowNicknameInput] = useState(null)
	const [newNickname, setNewNickname] = useState('')
	const [showThemePicker, setShowThemePicker] = useState(false)
	const [showThemeCreator, setShowThemeCreator] = useState(false)
	const [editedTheme, setEditedTheme] = useState(defaultThemeDoc)
	const [confirmCustomTheme, setConfirmCustomTheme] = useState(false)
	const [confirmThemeDelete, setConfirmThemeDelete] = useState(null)

	useEffect(() => {
		setShowThemeCreator(false)
		setShowNicknameModal(false)
	}, [chat.id])

	const sendMessage = async content => {
		const commentToAdd = {
			id: uniqueId,
			content: content,
			createdAt: timestamp.fromDate(new Date()),
			isSpecial: true,
		}

		await updateDocument(chat.id, {
			messages: [...chat.messages, commentToAdd],
		})
		if (!response.error) {
			onMessageResponse(null)
		}
	}

	const changeChatEmoji = async e => {
		await updateDocument(chat.id, {
			chatEmoji: e.unified,
		})
		if (!response.error) {
			sendMessage(`Set quick emoji to ${e.emoji}`)
		}
	}

	const handleNicknameInput = u => {
		setShowNicknameInput(u.id)
	}

	const changeNickname = user => {
		if (newNickname.trim() !== '' && newNickname.trim().length < 80) {
			chat.assignedUsers.forEach(u => {
				if (u !== user) {
					updateDocument(chat.id, {
						assignedUsers: [
							u,
							{
								id: user.id,
								displayName: user.displayName,
								nickname: newNickname.trim(),
								photoURL: user.photoURL,
							},
						],
					})
					setShowNicknameModal(false)
				}
				if (u === user) {
					sendMessage(`Set nickname of user ${u.displayName} to ${newNickname.trim()}`, newNickname.trim())
				}
			})
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
		<aside className='chat-options'>
			<Avatar src={otherUser.photoURL} />

			<h3>{otherUser.nickname}</h3>

			{/* <button className='btn' onClick={() => addDoc()}>
				add doc
			</button> */}

			<div
				className='option'
				onClick={() => {
					setShowThemePicker(true)
				}}>
				<div className='option__icon' style={{ background: spreadColors(currentTheme) }}></div>

				<div className='option__name'>Change theme</div>
			</div>

			<div
				className='option'
				onClick={() => {
					setShowEmojiPicker(true)
				}}>
				<div className='option__icon'>
					<i className='fa-solid fa-thumbs-up'></i>
				</div>
				<div className='option__name'>Change emoji icon</div>
			</div>

			<div
				className='option'
				onClick={() => {
					setShowNicknameModal(true)
				}}>
				<div className='option__icon'>Aa</div>
				<div className='option__name'>Edit nicknames</div>
			</div>

			{themes && (showThemePicker || showThemeCreator) && (
				<>
					<Modal
						show={showThemePicker}
						setShow={() => setShowThemePicker(false)}
						onClose={() => setConfirmThemeDelete(null)}
						disableOCH={showThemeCreator}>
						<ThemePicker
							themes={themes}
							chat={chat}
							setShowThemeCreator={setShowThemeCreator}
							setEditedTheme={setEditedTheme}
							setConfirmThemeDelete={setConfirmThemeDelete}
							confirmThemeDelete={confirmThemeDelete}
						/>
					</Modal>
					<Modal
						show={showThemeCreator}
						setShow={() => setShowThemeCreator(false)}
						onClose={() => {
							setEditedTheme(null)
							setConfirmCustomTheme(false)
						}}
						disableOCH={confirmCustomTheme}>
						<ThemeCreator
							setShowThemePicker={setShowThemePicker}
							setShowThemeCreator={setShowThemeCreator}
							chat={chat}
							editedTheme={editedTheme}
							setConfirmCustomTheme={setConfirmCustomTheme}
							confirmCustomTheme={confirmCustomTheme}
						/>
					</Modal>
				</>
			)}

			{showEmojiPicker && (
				<OutsideClickHandler
					onOutsideClick={() => {
						setShowEmojiPicker(false)
					}}>
					<EmojiPicker
						className='emoji-picker'
						onEmojiClick={e => {
							changeChatEmoji(e)
							setShowEmojiPicker(false)
						}}
						theme={Theme.DARK}
						previewConfig={{
							defaultCaption: '',
							defaultEmoji: null,
						}}
						// lazyLoadEmojis={true}
						emojiStyle={EmojiStyle.NATIVE}
					/>
				</OutsideClickHandler>
			)}

			<Modal
				show={showNicknameModal}
				setShow={() => setShowNicknameModal(false)}
				onClose={() => {
					setNewNickname('')
					setShowNicknameInput(null)
				}}>
				{chat.assignedUsers.map(u => (
					// <OutsideClickHandler onOutsideClick={() => setShowNicknameInput(null)}>
					<div
						key={u.id}
						className='user'
						onClick={() => {
							setNewNickname(' ')
							handleNicknameInput(u)
						}}>
						<div className='author'>
							<Avatar src={u.photoURL} />
							{showNicknameInput !== u.id && (
								<div className='flex-column'>
									<p className='user__display-name'>{u.nickname}</p>
									<p>Set nickname</p>
								</div>
							)}
							{showNicknameInput === u.id && (
								<input
									type='text'
									placeholder={u.nickname}
									value={newNickname}
									onChange={e => {
										setNewNickname(e.target.value)
									}}
								/>
							)}
						</div>

						{showNicknameInput !== u.id && <i className='fa-solid fa-pen-to-square'></i>}
						{showNicknameInput === u.id && (
							<i
								className='fa-solid fa-check'
								onClick={() => {
									changeNickname(u)
								}}></i>
						)}
					</div>
					// </OutsideClickHandler>
				))}
			</Modal>
		</aside>
	)
}
