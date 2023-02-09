import { useEffect, useState } from 'react'
import { useLogin } from '../../../hooks/useLogin'
import { Link } from 'react-router-dom'

// Styles & assets
import ShrekGif from '../../../assets/shrek-gif.gif'

// Components
import AuthTemplate from '../AuthTemplate'
import { Field } from '../../../components'

export default function ResetPassword() {
	const { sendPasswordReset, isPending, error, isFinished } = useLogin()

	const [email, setEmail] = useState('')
	const [timeToRedirect, setTimeToRedirect] = useState(15)

	const [formErrors, setFormErrors] = useState({
		email: ''
	})

	const handlePasswordReset = () => {
		if (!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
			setFormErrors(existing => ({
				...existing,
				email: 'Enter a valid email'
			}))
			return
		}

		sendPasswordReset(email)
	}

	useEffect(() => {
		if (isFinished === true) {
			countdown()
		}
	}, [isFinished])

	const countdown = () => {
		let redirectCountdown = setInterval(() => {
			if (timeToRedirect <= 0) {
				clearInterval(redirectCountdown)
			} else {
				setTimeToRedirect(prevTimeToRedirect => prevTimeToRedirect - 1)
			}
		}, 1000)
	}

	return (
		<AuthTemplate>
			{isFinished && (
				<div className='text-center auth__form-email-sent'>
					<img src={ShrekGif} alt='shrek' />

					<div className='auth__form-title'>
						<h2>Check your email</h2>
						<p>A password reset email has been sent to your email address</p>
					</div>

					<p className='auth__change-page'>
						Go back to <Link to='/login'>Login</Link>
					</p>

					<p className='redirect'>Redirecting in {timeToRedirect} s</p>
				</div>
			)}

			{!isFinished && (
				<>
					<div className='auth__form-title'>
						<h2>Forgot password?</h2>
						<p>Enter your email below to recieve password reset instructions</p>
					</div>

					<Field
						type='email'
						value={email}
						setValue={setEmail}
						label='Email'
						error={formErrors.email}
						resetError={() =>
							setFormErrors(existing => ({
								...existing,
								email: ''
							}))
						}
						onLostFocus={() => {
							if (
								email !== '' &&
								!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
							) {
								setFormErrors(existing => ({
									...existing,
									email: 'Please enter a valid email address'
								}))
							}
						}}
						helpText='Eg. icecream@gmail.com'
					/>

					{!isPending && (
						<button className='btn forgot-password' onClick={() => handlePasswordReset()}>
							Send reset link
						</button>
					)}
					{isPending && (
						<button className='btn forgot-password' disabled>
							Sending email...
						</button>
					)}

					<p className='auth__change-page'>
						No longer have Alzheimer? <Link to='/login'>Login</Link>
					</p>

					{error && <div className='error'>{error}</div>}
				</>
			)}
		</AuthTemplate>
	)
}
