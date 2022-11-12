import { useEffect, useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '../../hooks/useQuery'

// Styles & assets
import '../login/Login.scss'
import ShrekGif from '../../assets/shrek-gif.gif'

export default function SetNewPassword() {
	const { sendPasswordReset, resetPassword, isPending, error, isFinished } = useLogin()

	const [newPassword, setNewPassword] = useState('')
	// const [isFinished, setIsFinished] = useState(false)

	const oobCode = useQuery('oobCode')

	const handleSubmit = async e => {
		e.preventDefault()
		resetPassword(oobCode, newPassword)
	}

	const handleKey = e => {
		e.code === 'Enter' && handleSubmit(e)
	}

	return (
		<div className='login'>
			<div className='auth-decoration'>
				<div className='circle'></div>
				<div className='blur'></div>
			</div>

			<form className='auth-form' onSubmit={e => handleSubmit(e)}>
				{isFinished && (
					<div className='text-center email-sent'>
						<img src={ShrekGif} alt='' className='email-sent__img' />
						<h2>Password set successfully</h2>
						<p>You can now log in with your new password</p>

						<Link to='/login'>
							<button className='btn'>Back to Login</button>
						</Link>

						<p className='change-page'>
							Now log in and remember your password. <Link to='/login'> Login</Link>
						</p>
					</div>
				)}

				{!isFinished && (
					<>
						<div className='auth-form__title'>
							<h2>Set a new password</h2>
							<p>Enter a password that you will remember this time...</p>
						</div>

						<label>
							<span>Password</span>
							<input
								type='password'
								required
								onChange={e => setNewPassword(e.target.value)}
								value={newPassword}
								placeholder='Enter new password'
								onKeyDown={e => handleKey(e)}
							/>
						</label>

						{!isPending && <button className='btn'>Reset password</button>}
						{isPending && (
							<button className='btn' disabled>
								Setting new password...
							</button>
						)}

						<p className='change-page'>
							<Link to='/login'> Login</Link> instead?
						</p>

						{error && <div className='error'>{error}</div>}
					</>
				)}
			</form>
		</div>
	)
}
