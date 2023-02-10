import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCollection } from '../../../hooks/useCollection'

export default function ResponseField({ chat, messageResponse, onMessageResponse }) {
	const { user } = useAuthContext()
	const { documents: users } = useCollection('users')

	const getDoc = id => users?.filter(doc => doc.id === id)?.[0] ?? null

	return (
		<div className='response'>
			<div>
				<p className='response__to'>
					Responding to{' '}
					<span>
						{getDoc(chat.messages[messageResponse].createdBy)?.displayName === user.displayName ? (
							'yourself'
						) : (
							<b>{chat.messages[messageResponse].displayName}</b>
						)}
					</span>
				</p>
				<p className='response__content'>
					{chat.messages[messageResponse].content && (
						<>
							{chat.messages[messageResponse].content.substring(0, 70)}
							{chat.messages[messageResponse].content.length > 70 ? <span>...</span> : ''}
						</>
					)}

					{chat.messages[messageResponse].image && chat.messages[messageResponse].fileType === 'image' ? 'Image' : ''}
					{chat.messages[messageResponse].image && chat.messages[messageResponse].fileType === 'video' ? 'Video' : ''}
				</p>
			</div>

			<div className='response__close-btn' onClick={() => onMessageResponse(null)}>
				<i className='fa-solid fa-xmark'></i>
			</div>
		</div>
	)
}
