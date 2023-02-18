import React from 'react'
import { useAuthContext } from '../../../../hooks/useAuthContext'

export default function MessageResponse({ message, chat }) {
	const { user } = useAuthContext()

	const scrollToResponse = id => {
		const ref = document.getElementById(id)

		ref.scrollIntoView({ block: 'center' })
		setTimeout(() => {
			ref.classList.add('pop')

			setTimeout(() => {
				ref.classList.remove('pop')
			}, 800)
		}, 400)
	}

	return (
		<div
			onClick={() => scrollToResponse(chat.messages[message.response].id)}
			className={`message__response ${chat.messages[message.response].deleted ? 'deleted' : ''}`}>
			{message.createdBy !== user.uid && <div className='message__content-margin'></div>}

			{chat.messages[message.response].content && (
				<div className='message__response-message'>{chat.messages[message.response].content.substring(0, 55)}</div>
			)}

			<div className='message__response-img'>
				{chat.messages[message.response].image &&
					(chat.messages[message.response].fileType === 'image' ? (
						<img src={chat.messages[message.response].image} alt='' />
					) : (
						<video src={chat.messages[message.response].image}></video>
					))}
			</div>
		</div>
	)
}
