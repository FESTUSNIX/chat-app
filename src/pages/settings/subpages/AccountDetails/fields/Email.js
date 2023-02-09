import { useState } from 'react'
import { useAuthContext } from '../../../../../hooks/useAuthContext'
import { toast, ToastContainer } from 'react-toastify'
import { projectAuth } from '../../../../../firebase/config'

// Components
import { Modal, Loader, Field } from '../../../../../components'

const Email = () => {
	const { user } = useAuthContext()

	const [error, setError] = useState('')
	const [isPending, setIsPending] = useState(false)

	const [email, setEmail] = useState('')
	const [show, setShow] = useState(false)
	const [currentPassword, setCurrentPassword] = useState('')

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

	const updateEmail = async () => {
		const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

		setError(null)

		if (!email.match(regex)) {
			return setError('Invalid email address')
		}
		if (currentPassword === '') {
			return setError('Enter your password')
		}

		setIsPending(true)

		projectAuth
			.signInWithEmailAndPassword(user.email, currentPassword)
			.then(userCredential => {
				userCredential.user
					.updateEmail(email)
					.then(() => {
						setIsPending(false)
						setError(null)
						setShow(false)
						setEmail('')
						notify('Successfully updated email address')
					})
					.catch(error => {
						console.log(error.message)
						setError(error.message)
						setIsPending(false)
					})
			})
			.catch(error => {
				console.log(error.message)
				setError(error.message)
				setIsPending(false)
			})
	}

	return (
		<div className='account-details__details-field'>
			<ToastContainer />
			<h3>email</h3>
			<p>{user.email}</p>
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
					setEmail('')
				}}>
				<h3 className='mb05'>Change your email address</h3>
				<p>Enter a new email address</p>

				<label>
					<Field value={email} setValue={setEmail} label='Email' type='email' />
				</label>
				<label>
					<Field value={currentPassword} setValue={setCurrentPassword} label='Password' type='password' />
				</label>

				{isPending && <Loader />}
				{error && <div className='error'>{error}</div>}
				<div className='btn-group'>
					<button className='btn btn--secondary' onClick={() => setShow(false)}>
						cancel
					</button>
					<button className='btn' onClick={() => updateEmail()}>
						update
					</button>
				</div>
			</Modal>
		</div>
	)
}

export default Email
