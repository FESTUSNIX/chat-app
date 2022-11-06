import { useEffect, useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { Link } from 'react-router-dom'

// Styles & assets
import './Login.scss'
import ShrekGif from '../../assets/shrek-gif.gif'

export default function Login() {
	const [email, setEmail] = useState('')
	const { resetPassword, isPending, error, isFinished } = useLogin()
	const [timeToRedirect, setTimeToRedirect] = useState(15)

	const handlePasswordReset = e => {
		e.preventDefault()
		resetPassword(email)
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

	const handleKey = e => {
		e.code === 'Enter' && handlePasswordReset(e)
	}

	return (
		<div className='login'>
			<div className='auth-decoration'>
				<div className='circle'></div>
				<div className='blur'></div>
			</div>

			<div className='auth-form'>
				{isFinished && (
					<div className='text-center email-sent'>
						<img src={ShrekGif} alt='' className='email-sent__img' />
						<h2>Check your email</h2>
						<p>A password reset email has been sent to your email address</p>

						<Link to='/login'>
							<button className='btn'>Back to Login</button>
						</Link>

						<p className='redirect'>Redirecting in {timeToRedirect} s</p>
					</div>
				)}

				{!isFinished && (
					<>
						<div className='auth-form__title'>
							<h2>Forgot password?</h2>
							<p>Enter your email below to recieve password reset instructions</p>
						</div>

						<label>
							<span>Email</span>
							<input
								type='email'
								required
								onChange={e => setEmail(e.target.value)}
								value={email}
								placeholder='Enter your email'
								onKeyDown={e => handleKey(e)}
							/>
						</label>

						{!isPending && (
							<button className='btn' onClick={handlePasswordReset}>
								Reset password
							</button>
						)}
						{isPending && (
							<button className='btn' disabled>
								Sending email...
							</button>
						)}

						<p className='change-page'>
							No longer have Alzheimer? <Link to='/login'>Login</Link>
						</p>

						{error && <div className='error'>{error}</div>}
					</>
				)}
			</div>
		</div>
	)
}
