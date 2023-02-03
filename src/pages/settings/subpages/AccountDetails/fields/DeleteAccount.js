import { useEffect, useState } from 'react'
import { useAuthContext } from '../../../../../hooks/useAuthContext'

// Components
import Loader from '../../../../../components/Loader/Loader'
import Modal from '../../../../../components/Modal/Modal'
import { deleteUser } from 'firebase/auth'
import { projectAuth } from '../../../../../firebase/config'
import TextField from '../../../../../components/Inputs/Field/Field'

const DeleteAccount = () => {
	const { user } = useAuthContext()

	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(null)

	const [show, setShow] = useState(false)
	const [confirm, setConfirm] = useState('')
	const [startCountdown, setStartCountdown] = useState(false)
	const [timeToDelete, setTimeToDelete] = useState(10)
	const [credential, setCredential] = useState(null)

	useEffect(() => {
		if (startCountdown === true) {
			finalCountdown()
		}
	}, [startCountdown])

	const checkPassword = () => {
		if (isPasswordProvider()) {
			if (confirm === '') return setError('You must enter a valid password')

			projectAuth
				.signInWithEmailAndPassword(user.email, confirm)
				.then(userCredential => {
					setStartCountdown(true)
					setCredential(userCredential)
				})
				.catch(error => {
					console.log(error.message)
					setError('The password you entered is invalid')
				})
		}
		setStartCountdown(true)
	}

	const finalCountdown = () => {
		let redirectCountdown = setInterval(() => {
			if (timeToDelete < 0) {
				clearInterval(redirectCountdown)
			} else {
				setTimeToDelete(prevTimeToRedirect => prevTimeToRedirect - 1)
			}
		}, 1000)
		setTimeout(() => {
			handleDeleteUser()
		}, 10000)
	}

	const handleDeleteUser = () => {
		setError(null)

		deleteUser(user)
			.then(() => {
				setIsPending(false)
				setError(null)
				setShow(false)
			})
			.catch(error => {
				console.log(error.message)
				setError(error.message)
				setIsPending(false)
			})
	}

	const isPasswordProvider = () => {
		let res = false

		user.providerData.forEach(provider => {
			if (provider.providerId === 'password') {
				res = true
			}
		})

		return res
	}

	return (
		<div className='account-details__details-delete-account'>
			<button className='btn' onClick={() => setShow(true)}>
				Delete Account
			</button>

			<Modal
				show={show}
				setShow={() => setShow(false)}
				onClose={() => {
					setIsPending(false)
					setError(null)
					setShow(false)
					setConfirm('')
					setStartCountdown(false)
					setTimeToDelete(10)
				}}>
				<div className='modal__content-padding flex-column align-center'>
					{startCountdown && (
						<div className='countdown'>
							<h3>Deleting account in</h3>
							<div>{timeToDelete}</div>

							<button
								className='btn'
								onClick={() => {
									setShow(false)
								}}>
								cancel
							</button>
						</div>
					)}
					{!startCountdown && (
						<>
							<i className='fa-solid fa-trash-can'></i>

							<h3>Delete Account?</h3>
							<p className='mb0'>You'll permanently lose your:</p>

							<ul>
								<li>
									<i className='fa-solid fa-xmark'></i>
									<span>Profile</span>
								</li>
								<li>
									<i className='fa-solid fa-xmark'></i>
									<span>Messages</span>
								</li>
								<li>
									<i className='fa-solid fa-xmark'></i>
									<span>Personal data</span>
								</li>
							</ul>

							{isPasswordProvider() && (
								<label>
									<p>Enter your password to confirm</p>

									<TextField value={confirm} setValue={setConfirm} label='Password' type='password' />
								</label>
							)}
							{isPending && <Loader />}
							{error && <div className='error'>{error}</div>}
						</>
					)}
				</div>

				{!startCountdown && (
					<div className='btn-group'>
						<button
							className='btn btn--secondary'
							onClick={() => {
								setShow(false)
							}}>
							cancel
						</button>
						<button
							className='btn'
							onClick={() => {
								checkPassword()
							}}>
							confirm
						</button>
					</div>
				)}
			</Modal>
		</div>
	)
}

export default DeleteAccount
