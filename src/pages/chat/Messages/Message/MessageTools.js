import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import OutsideClickHandler from 'react-outside-click-handler'
import { Tooltip } from '../../../../components'
import { useAuthContext } from '../../../../hooks/useAuthContext'
import { useFirestore } from '../../../../hooks/useFirestore'

export const MessageTools = ({ showEmojis, setShowEmojis, message, chat, onMessageResponse, setMessageToDelete }) => {
	const { user } = useAuthContext()
	const { updateDocument } = useFirestore('projects')

	const reactWithEmoji = async (e, message) => {
		const indexOfMessage = chat.messages.indexOf(message)

		let otherUserReaction = null

		if (message.emojiReactions && message.emojiReactions.length > 0) {
			message.emojiReactions.forEach(rec => {
				if (rec !== null) {
					if (rec.id !== user.uid) {
						otherUserReaction = rec
					}
				}
			})
		}

		const emojiToAdd = {
			id: user.uid,
			content: e.emoji
		}

		chat.messages[indexOfMessage] = {
			...chat.messages[indexOfMessage],
			emojiReactions: [
				otherUserReaction ? otherUserReaction : null,
				{
					...emojiToAdd
				}
			]
		}

		try {
			await updateDocument(chat.id, {
				messages: [...chat.messages]
			})
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<div className={`message-tools ${showEmojis === message ? 'visible' : ''}`}>
				<i
					className='fa-regular fa-face-smile'
					onClick={() => {
						setShowEmojis(message)
					}}>
					<Tooltip>React</Tooltip>
				</i>

				{user.uid === message.createdBy && (
					<i className='fa-solid fa-trash-can' onClick={() => setMessageToDelete(message)}>
						<Tooltip>Remove</Tooltip>
					</i>
				)}

				<i
					className='fa-solid fa-reply'
					onClick={() => {
						onMessageResponse(Number(chat.messages.indexOf(message)))
					}}>
					<Tooltip>Reply</Tooltip>
				</i>
			</div>

			{showEmojis === message && (
				<div className='react-with-emoji'>
					<OutsideClickHandler
						onOutsideClick={() => {
							setShowEmojis(null)
						}}
						disabled={showEmojis === message ? false : true}>
						<EmojiPicker
							className='emoji-picker'
							onEmojiClick={e => {
								reactWithEmoji(e, message)
							}}
							theme={Theme.DARK}
							previewConfig={{
								defaultCaption: '',
								defaultEmoji: null
							}}
							width={300}
							height={400}
							emojiStyle={EmojiStyle.NATIVE}
						/>
					</OutsideClickHandler>

					<svg height='12' viewBox='0 0 25 12' width='25' data-darkreader-inline-fill=''>
						<path d='M24.553.103c-2.791.32-5.922 1.53-7.78 3.455l-9.62 7.023c-2.45 2.54-5.78 1.645-5.78-2.487V2.085C1.373 1.191.846.422.1.102h24.453z'></path>
					</svg>
				</div>
			)}
		</>
	)
}
