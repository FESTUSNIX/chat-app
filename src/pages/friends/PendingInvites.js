import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import Avatar from '../../components/Avatar/Avatar'
import Tooltip from '../../components/Tooltip/Tooltip'
import { projectFirestore, timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'
import { useDocument } from '../../hooks/useDocument'
import { useFirestore } from '../../hooks/useFirestore'
import { doc, setDoc } from 'firebase/firestore'

const PendingInvites = () => {
	const { user } = useAuthContext()
	const { documents: users } = useCollection('users')
	const { documents: chats } = useCollection('projects')
	const { document: currentUserDoc } = useDocument('users', user.uid)
	const { updateDocument } = useFirestore('users')

	const [error, setError] = useState(null)

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

	const getDoc = id => {
		let res = null

		if (users) {
			res = users.filter(doc => {
				if (doc.id === id) {
					return true
				}
				return false
			})[0]
		}

		return res
	}

	const handleSelect = async addUser => {
		const combinedId = user.uid > addUser.id ? user.uid + addUser.id : addUser.id + user.uid

		const docToAdd = {
			id: combinedId,
			assignedUsers: [
				{
					id: user.uid,
					nickname: user.displayName,
				},
				{
					id: addUser.id,
					nickname: addUser.displayName,
				},
			],
			assignedUsersId: [user.uid, addUser.id],
			chatEmoji: '1f44d',
			messages: [],
			updatedAt: timestamp.fromDate(new Date()),
			createdAt: timestamp.fromDate(new Date()),
			customThemes: [],
		}

		try {
			const exists = chats.some(c => c.id === combinedId)

			if (!exists && user.uid !== addUser.id) {
				// Create a chat in chats collection

				// await addDocument(docToAdd)
				await setDoc(doc(projectFirestore, 'projects', combinedId), docToAdd)
			}
		} catch (err) {
			console.log(err.message)
			setError(err.message)
		}
	}

	const acceptInvite = async (u, index) => {
		setError(null)

		const arrCopy = currentUserDoc.friends

		arrCopy[index] = {
			id: u.id,
			isPending: false,
			accepted: true,
		}

		const arrCopy2 = getDoc(u.id).friends
		let index2

		arrCopy2.some((f, i) => {
			if (f.id === currentUserDoc.id) {
				index2 = i
				return true
			}
			return false
		})

		arrCopy2[index2] = {
			id: currentUserDoc.id,
			isPending: false,
			accepted: true,
		}

		try {
			await updateDocument(user.uid, {
				friends: arrCopy,
			})

			await updateDocument(u.id, {
				friends: arrCopy2,
			})

			await handleSelect(getDoc(u.id))

			notify('Successfully added user to your friends')
		} catch (error) {
			setError(error.message)
			console.log(error.message)
		}
	}

	const declineInvite = async (u, index) => {
		setError(null)

		const arrCopy = currentUserDoc.friends
		arrCopy.splice(index, 1)

		const arrCopy2 = getDoc(u.id).friends

		let index2
		arrCopy2.some((f, i) => {
			if (f.id === currentUserDoc.id) {
				index2 = i
				return true
			}
			return false
		})
		arrCopy2.splice(index2, 1)

		try {
			await updateDocument(user.uid, {
				friends: arrCopy,
			})

			await updateDocument(u.id, {
				friends: arrCopy2,
			})

			notify('Successfully declined/canceled invitation')
		} catch (error) {
			setError(error.message)
			console.log(error.message)
		}
	}

	return (
		<div className='friends__invites mt2'>
			<ToastContainer />
			{currentUserDoc && currentUserDoc.friends && (
				<>
					{currentUserDoc.friends.map(
						(f, index) =>
							!f.isPending &&
							!f.accepted && (
								<div className='friends__invites-user' key={f.id}>
									<div className='flex-row gap1 w100'>
										<Avatar src={getDoc(f.id) && getDoc(f.id).photoURL} />

										<div className='flex-column flex-grow-1'>
											<p>{getDoc(f.id) && getDoc(f.id).displayName}</p>
											<p>You invited this user</p>
										</div>
									</div>

									<div className='flex-row gap1 options'>
										<div className='options__decline' onClick={() => declineInvite(f, index)}>
											<Tooltip>Cancel invite</Tooltip>
											<i className='fa-solid fa-xmark'></i>
										</div>
									</div>
								</div>
							)
					)}

					{currentUserDoc.friends.filter(f => !f.accepted && !f.isPending).length > 0 ? (
						<div className='separator mb1 mt1'></div>
					) : (
						''
					)}
					{currentUserDoc.friends.filter(f => !f.accepted).length === 0 ? (
						<div className='absolute-center'>There are no pending invites</div>
					) : (
						''
					)}

					{currentUserDoc.friends.map(
						(f, index) =>
							f.isPending &&
							!f.accepted && (
								<div className='friends__invites-user' key={f.id}>
									<div className='flex-row gap1'>
										<Avatar src={getDoc(f.id) && getDoc(f.id).photoURL} />

										<div className='flex-column'>
											<p>{getDoc(f.id) && getDoc(f.id).displayName}</p>
											<p>Sent you an invite</p>
										</div>
									</div>

									<div className='flex-row gap1 options'>
										<div className='options__decline' onClick={() => declineInvite(f, index)}>
											<Tooltip>Decline</Tooltip>
											<i className='fa-solid fa-xmark'></i>
										</div>

										<div className='options__accept' onClick={() => acceptInvite(f, index)}>
											<Tooltip>Accept</Tooltip>
											<i className='fa-solid fa-check'></i>
										</div>
									</div>
								</div>
							)
					)}
				</>
			)}

			{error && <div className='error'>{error}</div>}
		</div>
	)
}
export default PendingInvites
