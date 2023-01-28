import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'
import { useDocument } from '../../hooks/useDocument'
import { useFirestore } from '../../hooks/useFirestore'

// Components
import Field from '../../components/Inputs/Field/Field'

const AddFriend = () => {
	const { user } = useAuthContext()
	const { document: currentUserDoc } = useDocument('users', user.uid)
	const { documents: users } = useCollection('users')
	const { updateDocument } = useFirestore('users')

	const [inputError, setInputError] = useState(null)
	const [userCode, setUserCode] = useState('')

	const notify = message =>
		toast.success(message, {
			position: 'bottom-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'dark',
		})

	const addFriend = async () => {
		setInputError(null)

		let userDoc = null

		users.forEach(u => {
			if (u.id === userCode.trim()) {
				userDoc = u
			}
		})

		if (userCode === '') {
			setInputError('Please enter code')
			return
		}
		if (userDoc === null) {
			setInputError('Could not find user with this id')
			return
		}
		if (currentUserDoc.friends && currentUserDoc.friends.some(f => f.id === userCode.trim())) {
			setInputError("You've already invited this user or this user has invited you")
			return
		}

		try {
			await updateDocument(user.uid, {
				friends: [
					...(currentUserDoc.friends ? currentUserDoc.friends : []),
					{
						id: userDoc.id,
						isPending: false,
						accepted: false,
					},
				],
			})

			await updateDocument(userDoc.id, {
				friends: [
					...(userDoc.friends ? userDoc.friends : []),
					{
						id: currentUserDoc.id,
						isPending: true,
						accepted: false,
					},
				],
			})

			notify('Successfully sent invite')
			setUserCode('')
		} catch (error) {
			setInputError(error.message)
			console.log(error.message)
		}
	}

	return (
		<div className='friends__add'>
			<ToastContainer />
			<h3 className='friends__add-title'>add friend</h3>
			<div className='friends__add-description'>
				<span>Enter invite code of user you want to add. </span>
				<span>
					You can find the code in <Link to='/settings/account-details'>account settings.</Link>
				</span>
			</div>

			<Field
				value={userCode}
				setValue={setUserCode}
				placeholder='Enter Code'
				error={inputError}
				resetError={() => setInputError(null)}
				after={
					<button className='btn btn--secondary text-capitalize' onClick={() => addFriend()}>
						invite
					</button>
				}
			/>
		</div>
	)
}

export default AddFriend
