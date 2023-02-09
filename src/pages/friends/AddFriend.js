import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'
import { useDocument } from '../../hooks/useDocument'
import { useFirestore } from '../../hooks/useFirestore'

// Components
import { Avatar, Field, Tooltip } from '../../components/'

const AddFriend = () => {
	const { user } = useAuthContext()
	const { document: currentUserDoc } = useDocument('users', user.uid)
	const { documents: users } = useCollection('users')
	const { updateDocument } = useFirestore('users')

	const [inputError, setInputError] = useState(null)
	const [userCode, setUserCode] = useState('')
	const [query, setQuery] = useState('')

	const notify = message =>
		toast.success(message, {
			position: 'bottom-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'dark'
		})

	const updateFriendsDocument = async userDoc => {
		try {
			await updateDocument(user.uid, {
				friends: [
					...(currentUserDoc?.friends ?? []),
					{
						id: userDoc.id,
						isPending: false,
						accepted: false
					}
				]
			})

			await updateDocument(userDoc.id, {
				friends: [
					...(userDoc?.friends ?? []),
					{
						id: currentUserDoc.id,
						isPending: true,
						accepted: false
					}
				]
			})

			notify('Successfully sent invite')
			setUserCode('')
		} catch (error) {
			setInputError(error.message)
			console.log(error.message)
		}
	}

	const validateUserCode = () => {
		setInputError(null)

		let userDoc = users.filter(u => u.id === userCode.trim()) ?? null

		if (!userCode) return setInputError('Please enter code')
		if (!userDoc?.length) return setInputError('Could not find user with this id')
		if (currentUserDoc?.friends?.some(f => f.id === userCode.trim()))
			return setInputError("You've already invited this user or this user has invited you")

		updateFriendsDocument(userDoc)
	}

	const isAlreadyFriend = u => currentUserDoc?.friends?.filter(f => f.id === u.id)?.[0] ?? false

	return (
		<div className='friends__add'>
			<ToastContainer />
			<h3 className='friends__add-title'>add friend</h3>
			<div className='friends__add-description'>
				<span>Enter invite code of user you want to add. </span>
				<span>
					You can find the code in <Link to='/settings/account-details'>account settings.</Link> (beta)
				</span>
			</div>

			<Field
				value={userCode}
				setValue={setUserCode}
				placeholder='Enter Code'
				error={inputError}
				resetError={() => setInputError(null)}
				after={
					<button className='btn btn--secondary text-capitalize' onClick={() => validateUserCode()}>
						invite
					</button>
				}
			/>

			<div className='separator mt2 mb2'>
				<span>or</span>
			</div>

			<div className='friends__add-search'>
				<Field
					value={query}
					setValue={setQuery}
					label='Search for a user'
					after={<i className='fa-solid fa-search'></i>}
				/>

				<div className='users-list custom-scrollbar'>
					{users
						?.filter(
							u =>
								u.displayName.toLowerCase().includes(query.toLowerCase()) && query.trim() !== '' && !isAlreadyFriend(u)
						)
						.map(u => (
							<div key={u.id} className='users-list__user'>
								<div className='flex-row gap05'>
									<Avatar src={u.photoURL} />
									<p className='text-clip'>{u.displayName}</p>
								</div>

								<i className='fa-solid fa-user-plus' onClick={() => updateFriendsDocument(u)}>
									<Tooltip pos='left'>Invite</Tooltip>
								</i>
							</div>
						))}
				</div>
			</div>
		</div>
	)
}

export default AddFriend
