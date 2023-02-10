import React, { useState } from 'react'
import { Avatar, Modal } from '../../../../components'
import { useAuthContext } from '../../../../hooks/useAuthContext'
import { useCollection } from '../../../../hooks/useCollection'
import { useFirestore } from '../../../../hooks/useFirestore'

export const MessageEmojiReactions = ({ message, chat }) => {
	const { user } = useAuthContext()
	const { updateDocument } = useFirestore('projects')
	const { documents: users } = useCollection('users')

	const [showModal, setShowModal] = useState(false)
	const [emojiReactions, setEmojiReactions] = useState([])

	const handleReactionNicknames = reaction => chat.assignedUsers.filter(u => u.id === reaction.id)?.[0].nickname ?? null

	const deleteEmojiReaction = async (message, reaction) => {
		let otherUserReaction = null
		if (reaction.id === user.uid) {
			message?.emojiReactions?.forEach(r => {
				if (r !== null && r.id !== user.uid) otherUserReaction = r
			})

			const indexOfMessage = chat.messages.indexOf(message)

			chat.messages[indexOfMessage] = {
				...chat.messages[indexOfMessage],
				emojiReactions: [otherUserReaction]
			}

			try {
				await updateDocument(chat.id, {
					messages: [...chat.messages]
				})
				setEmojiReactions([])
				setShowModal(false)
			} catch (error) {
				console.log(error)
			}
		}
	}

	const getDoc = id => users?.filter(doc => doc.id === id)?.[0] ?? null
	const getLocalUser = id => chat?.assignedUsers.filter(u => u.id === id)?.[0] ?? null

	return (
		<>
			<div
				className='emoji-reactions'
				onClick={() => {
					setEmojiReactions(message.emojiReactions)
					setShowModal(true)
				}}>
				{message.emojiReactions.map(reaction =>
					reaction !== null ? (
						<div key={reaction.id} className='emoji-reactions__reaction'>
							<span className='emoji-reactions__reaction-content'>{reaction.content}</span>
							<span className='emoji-reactions__reaction-display-name'>{handleReactionNicknames(reaction)}</span>
						</div>
					) : null
				)}
			</div>

			<Modal show={showModal} setShow={() => setShowModal(false)} onClose={() => setEmojiReactions([])}>
				<div className='show-reactions'>
					<h3>Reactions</h3>

					{emojiReactions.map(reaction =>
						reaction !== null ? (
							<div
								className={`show-reactions__reaction ${reaction.id === user.uid ? 'cursor-pointer' : ''}`}
								onClick={() => {
									deleteEmojiReaction(message, reaction)
								}}
								key={reaction.id}>
								<div className='show-reactions__reaction-author'>
									<Avatar src={getDoc(reaction.id).photoURL} />
									<div>
										<p>{getLocalUser(reaction.id).nickname}</p>
										{reaction.id === user.uid && <p>Click to delete</p>}
									</div>
								</div>

								<span className='show-reactions__reaction-emoji'>{reaction.content}</span>
							</div>
						) : null
					)}
				</div>
			</Modal>
		</>
	)
}
