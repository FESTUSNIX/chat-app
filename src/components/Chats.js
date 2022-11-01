import { useState } from 'react'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import { projectFirestore, timestamp } from '../firebase/config'
import { useCollection } from '../hooks/useCollection'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'

// Compontents
import ChatsList from './ChatsList'

// Styles
import './Chats.scss'
import Avatar from './Avatar'

export default function OnlineUsers() {
	const { user } = useAuthContext()
	const { logout, isPending } = useLogout()
	const { documents: users } = useCollection('users')
	const { documents: chats } = useCollection(
		'projects',
		['assignedUsersId', 'array-contains', user.uid],
		['updatedAt', 'desc']
	)

	const [query, setQuery] = useState('')

	const handleSelect = async addUser => {
		// Check whether the group(chats in firestore) exists, if not create
		const combinedId = user.uid > addUser.id ? user.uid + addUser.id : addUser.id + user.uid

		try {
			const res = await getDoc(doc(projectFirestore, 'projects', combinedId))

			if (!res.exists() && user.uid !== addUser.id) {
				// Create a chat in chats collection

				await setDoc(doc(projectFirestore, 'projects', combinedId), {
					id: combinedId,
					assignedUsersId: [user.uid, addUser.id],
					assignedUsersName: [user.displayName, addUser.displayName],
					assignedUsersPhotoURL: [user.photoURL, addUser.photoURL],
					messages: [],
					updatedAt: timestamp.fromDate(new Date()),
				})
			}
		} catch (err) {}

		setQuery('')
	}

	return (
		<div className='user-list'>
			<div className='search'>
				<div>
					<div className='search-form'>
						<input
							type='text'
							placeholder='Find a user'
							// onKeyUp={handleSearch}
							onChange={e => setQuery(e.target.value)}
							value={query}
						/>
					</div>
					{query !== '' && (
						<>
							<div className='add-users'>
								{users &&
									users
										.filter(user => user.displayName.toLowerCase().trim().replace(/\s+/g, '').includes(query))
										.map(user => (
											<div key={user.id} className='user-chat' onClick={() => handleSelect(user)}>
												<img src={user.photoURL} alt='' />
												<div className='user-chat-info'>
													<span>{user.displayName}</span>
												</div>
											</div>
										))}

								{query.trim() === '' && <span>User not found!</span>}
							</div>
						</>
					)}
					<div className='chats'>{query === '' && chats && <ChatsList projects={chats} />}</div>
				</div>
			</div>
			<div className='user'>
				<div>
					<Avatar src={user.photoURL} />
					<span>{user.displayName}</span>
				</div>

				{!isPending && user && (
					<button className='btn' onClick={logout}>
						Logout
					</button>
				)}

				{isPending && (
					<button className='btn' disabled>
						Logging out...
					</button>
				)}
			</div>
		</div>
	)
}
