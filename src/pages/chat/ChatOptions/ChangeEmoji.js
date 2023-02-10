import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import React from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { Modal } from '../../../components'
import { useFirestore } from '../../../hooks/useFirestore'

export const ChangeEmoji = ({ chat, showEmojiPicker, setShowEmojiPicker, sendMessage }) => {
	const { updateDocument, response } = useFirestore('projects')

	const changeChatEmoji = async e => {
		await updateDocument(chat.id, {
			chatEmoji: e.unified
		})
		if (!response.error) {
			sendMessage(`Set quick emoji to ${e.emoji}`)
		}
	}

	return (
		<Modal show={showEmojiPicker} setShow={() => setShowEmojiPicker(false)}>
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
						defaultEmoji: null
					}}
					emojiStyle={EmojiStyle.NATIVE}
				/>
			</OutsideClickHandler>
		</Modal>
	)
}
