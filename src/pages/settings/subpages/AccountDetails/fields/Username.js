import { useState } from 'react'
import { useFirestore } from '../../../../../hooks/useFirestore'
import { useAuthContext } from '../../../../../hooks/useAuthContext'
import { updateProfile } from 'firebase/auth'
import { toast, ToastContainer } from 'react-toastify'

// Components
import Modal from '../../../../../components/Modal/Modal'
import Loader from '../../../../../components/Loader/Loader'

const Username = () => {
	const { user } = useAuthContext()
	const { updateDocument } = useFirestore('users')

	const [error, setError] = useState('')
	const [isPending, setIsPending] = useState(false)

	const [username, setUsername] = useState('')
	const [show, setShow] = useState(false)

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

	const updateUsername = async () => {
		setError(null)
		if (username.length > 3) {
			setIsPending(true)

			try {
				await updateProfile(user, {
					displayName: username,
				})
				await updateDocument(user.uid, {
					displayName: username,
				})

				setIsPending(false)
				setError(null)
				setShow(false)
				setUsername('')
				notify('Successfully set a new username')
			} catch (error) {
				setError(error.message)
				console.log(error.message)
				setIsPending(false)
			}
		} else {
			setError('Username must be at least 3 characters long')
		}
	}

	return (
		<div className='account-details__details-field'>
			<ToastContainer />
			<h3>username</h3>
			<p>{user.displayName}</p>
			{/* <i className='fa-solid fa-pencil' onClick={() => setShow(true)}>
							<Tooltip>Edit</Tooltip>
						</i> */}
			<button className='btn btn--secondary' onClick={() => setShow(true)}>
				edit
			</button>
			<Modal
				show={show}
				setShow={() => setShow(false)}
				onClose={() => {
					setIsPending(false)
					setError(null)
					setShow(false)
					setUsername('')
				}}>
				<h3>Change your username</h3>
				<p>Enter a new, always cool username</p>

				<input type='text' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />

				{isPending && <Loader />}
				{error && <div className='error'>{error}</div>}
				<div className='btn-group'>
					<button className='btn btn--secondary' onClick={() => setShow(false)}>
						cancel
					</button>
					<button className='btn' onClick={() => updateUsername()}>
						update
					</button>
				</div>
			</Modal>
		</div>
	)
}

export default Username
