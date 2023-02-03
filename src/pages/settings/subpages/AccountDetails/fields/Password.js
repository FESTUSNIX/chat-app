import { useState } from 'react'
import { useAuthContext } from '../../../../../hooks/useAuthContext'
import { projectAuth } from '../../../../../firebase/config'
import { useLogout } from '../../../../../hooks/useLogout'

// Components
import Modal from '../../../../../components/Modal/Modal'
import Loader from '../../../../../components/Loader/Loader'
import Field from '../../../../../components/Inputs/Field/Field'

const Password = () => {
	const { user } = useAuthContext()
	const { logout } = useLogout()

	const [error, setError] = useState('')
	const [isPending, setIsPending] = useState(false)
	const [show, setShow] = useState(false)

	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmNewPassword, setConfirmNewPassword] = useState('')

	const updatePassword = () => {
		setError(null)

		if (currentPassword === '') {
			return setError('Enter a password')
		}
		if (newPassword === '' || confirmNewPassword === '') {
			return setError('Enter a new password')
		}
		if (newPassword !== confirmNewPassword) {
			return setError('Passwords must match')
		}

		setIsPending(true)

		projectAuth
			.signInWithEmailAndPassword(user.email, currentPassword)
			.then(userCredential => {
				userCredential.user
					.updatePassword(newPassword)
					.then(() => {
						setIsPending(false)
						setError(null)
						setShow(false)
						setCurrentPassword('')
						setNewPassword('')
						setConfirmNewPassword('')
						logout()
					})
					.catch(error => {
						console.log(error.message)
						setError(error.message)
						setIsPending(false)
					})
			})
			.catch(error => {
				console.log(error.message)
				setError('Enter a correct password')
				setIsPending(false)
			})
	}

	return (
		<div className='account-details__details-field'>
			<h3>password</h3>
			<p>***************</p>

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
					setCurrentPassword('')
					setNewPassword('')
					setConfirmNewPassword('')
				}}>
				<h3 className='mb05'>Change password</h3>
				<p>Enter your current password and a new password. Also remember that your name isn't a good password...</p>

				<label>
					<Field value={currentPassword} setValue={setCurrentPassword} label='Current password' type='password' />
				</label>
				<label>
					<Field value={newPassword} setValue={setNewPassword} label='New password' type='password' />
				</label>
				<label>
					<Field value={confirmNewPassword} setValue={setConfirmNewPassword} label='Password' type='password' />
				</label>

				{isPending && <Loader />}
				{error && <div className='error'>{error}</div>}
				<div className='btn-group'>
					<button className='btn btn--secondary' onClick={() => setShow(false)}>
						cancel
					</button>
					<button className='btn' onClick={() => updatePassword()}>
						update
					</button>
				</div>
			</Modal>
		</div>
	)
}

export default Password
