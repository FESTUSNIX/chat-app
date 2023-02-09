import { useState } from 'react'
import { useLogin } from '../../../hooks/useLogin'
import { Link } from 'react-router-dom'
import { useQuery } from '../../../hooks/useQuery'

// Styles & assets
import ShrekGif from '../../../assets/shrek-gif.gif'

// Components
import AuthTemplate from '../AuthTemplate'
import { Field } from '../../../components'

export default function SetNewPassword() {
	const { resetPassword, isPending, error, isFinished } = useLogin()

	const [newPassword, setNewPassword] = useState('')

	const oobCode = useQuery('oobCode')

	const handleSubmit = async () => {
		if (newPassword.trim().length < 6) {
			setFormErrors(existing => ({
				...existing,
				password: 'Password must be at least 6 characters long'
			}))
			return
		}

		await resetPassword(oobCode, newPassword)
	}

	const [formErrors, setFormErrors] = useState({
		password: ''
	})

	return (
		<AuthTemplate>
			{isFinished && (
				<div className='auth__form-email-sent'>
					<img src={ShrekGif} alt='' />
					<div className='auth__form-title'>
						<h2>Password set successfully</h2>
						<p>You can now log in with your new password</p>
					</div>

					<Link to='/login'>
						<button className='btn'>Back to Login</button>
					</Link>

					<p className='auth__change-page'>
						Now log in and remember your password. <Link to='/login'> Login</Link>
					</p>
				</div>
			)}

			{!isFinished && (
				<>
					<div className='auth__form-title'>
						<h2>Set a new password</h2>
						<p>Enter a password that you will remember this time...</p>
					</div>

					<Field
						type='password'
						value={newPassword}
						setValue={setNewPassword}
						label='New Password'
						error={formErrors.password}
						resetError={() =>
							setFormErrors(existing => ({
								...existing,
								password: ''
							}))
						}
						onLostFocus={() => {
							if (newPassword !== '' && newPassword.trim().length < 6) {
								setFormErrors(existing => ({
									...existing,
									password: 'Password must be at least 6 characters long'
								}))
							}
						}}
					/>

					{!isPending && (
						<button className='btn mb1' onClick={() => handleSubmit()}>
							Reset password
						</button>
					)}
					{isPending && (
						<button className='btn mb1' disabled>
							Setting new password...
						</button>
					)}

					<p className='auth__change-page'>
						<Link to='/login'>Login</Link> instead?
					</p>

					{error && <div className='error'>{error}</div>}
				</>
			)}
		</AuthTemplate>
	)
}
