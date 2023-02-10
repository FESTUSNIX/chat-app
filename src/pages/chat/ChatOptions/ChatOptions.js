import { useEffect, useState } from 'react'
import { useFirestore } from '../../../hooks/useFirestore'
import { timestamp } from '../../../firebase/config'
import { v4 as uuid } from 'uuid'

// Styles && Assets
import './ChatOptions.scss'
import MediaQuery from 'react-responsive'

// Components
import { AvatarWithStatus } from '../../../components'
import ChangeNicknames from './ChangeNicknames'
import { ChangeEmoji } from './ChangeEmoji'
import ThemeOptions from './ThemeOptions'

export default function ChatOptions({
	onMessageResponse,
	otherUser,
	chat,
	currentTheme,
	otherUserLocal,
	setShowChatOptions
}) {
	const uniqueId = uuid()

	const { updateDocument, response } = useFirestore('projects')

	const [showNicknameModal, setShowNicknameModal] = useState(false)
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [showThemePicker, setShowThemePicker] = useState(false)
	const [showThemeCreator, setShowThemeCreator] = useState(false)

	useEffect(() => {
		setShowEmojiPicker(false)
		setShowThemeCreator(false)
		setShowThemePicker(false)
		setShowNicknameModal(false)
	}, [chat.id])

	const sendMessage = async content => {
		const commentToAdd = {
			id: uniqueId,
			content: content,
			createdAt: timestamp.fromDate(new Date()),
			isSpecial: true
		}

		await updateDocument(chat.id, {
			messages: [...chat.messages, commentToAdd]
		})
		if (!response.error) {
			onMessageResponse(null)
		}
	}

	const spreadColors = theme => {
		let colors = null

		theme.colors.msgBgOwner.forEach(color => {
			colors = colors === null ? color.value : `${colors}, ${color.value}`
		})

		return theme.colors.msgBgOwner.length === 1 ? colors : `linear-gradient(${colors})`
	}

	return (
		<aside className='chat-options'>
			<MediaQuery maxWidth={768}>
				<i className='fa-solid fa-arrow-left close-chat-options' onClick={() => setShowChatOptions(false)}></i>
			</MediaQuery>
			{otherUser && <AvatarWithStatus userId={otherUser.id} linkToProfile={true} />}
			<h3>{otherUserLocal.nickname}</h3>
			<div
				className='option'
				onClick={() => {
					setShowThemePicker(true)
				}}>
				<div className='option__name'>Change theme</div>
				<div className='option__icon' style={{ background: spreadColors(currentTheme) }}></div>
			</div>
			<div
				className='option'
				onClick={() => {
					setShowEmojiPicker(true)
				}}>
				<div className='option__name'>Change emoji icon</div>
				<div className='option__icon'>
					<i className='fa-solid fa-thumbs-up'></i>
				</div>
			</div>
			<div
				className='option'
				onClick={() => {
					setShowNicknameModal(true)
				}}>
				<div className='option__name'>Edit nicknames</div>
				<div className='option__icon'>Aa</div>
			</div>

			<ThemeOptions
				chat={chat}
				showThemePicker={showThemePicker}
				showThemeCreator={showThemeCreator}
				setShowThemeCreator={setShowThemeCreator}
				setShowThemePicker={setShowThemePicker}
			/>

			<ChangeEmoji
				chat={chat}
				showEmojiPicker={showEmojiPicker}
				setShowEmojiPicker={setShowEmojiPicker}
				sendMessage={sendMessage}
			/>

			<ChangeNicknames
				chat={chat}
				showNicknameModal={showNicknameModal}
				setShowNicknameModal={setShowNicknameModal}
				sendMessage={sendMessage}
			/>
		</aside>
	)
}
