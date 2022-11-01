import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { Link } from 'react-router-dom'

// Styles & assets
import './Login.scss'
import googleLogo from '../../assets/btn_google_dark_normal_ios.svg'
import githubLogo from '../../assets/GitHub-Mark-Light-32px.png'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { login, loginWithGoogle, loginWithGithub, isPending, error } = useLogin()

	const handleSubmit = e => {
		e.preventDefault()
		login(email, password)
	}
	const handleSubmitWithGoogle = e => {
		e.preventDefault()
		loginWithGoogle()
	}
	const handleSubmitWithGithub = e => {
		e.preventDefault()
		loginWithGithub()
	}

	return (
		<div className='login'>
			<div className='auth-decoration'>
				<div className='circle'></div>
				<div className='blur'></div>
			</div>

			<form className='auth-form' onSubmit={handleSubmit}>
				<div className='auth-form__title'>
					<h2>Welcome back</h2>
				</div>

				<label>
					<span>Email</span>
					<input
						type='email'
						required
						onChange={e => setEmail(e.target.value)}
						value={email}
						placeholder='Enter your email'
					/>
				</label>

				<label>
					<span>Password</span>
					<input
						type='password'
						required
						onChange={e => setPassword(e.target.value)}
						value={password}
						placeholder='Enter your password'
					/>
				</label>
				<Link to={'/recover-password'} className='reset-password'>
					Forgot password?
				</Link>

				{!isPending && <button className='btn'>Login</button>}
				{isPending && (
					<button className='btn' disabled>
						Loading
					</button>
				)}

				<div className='others-separator'>
					<span>or</span>
				</div>

				<button className='google-btn' onClick={handleSubmitWithGoogle}>
					<img src={googleLogo} alt='google logo' />
					<span>Sign in with google</span>
				</button>

				<button className='github-btn' onClick={handleSubmitWithGithub}>
					<img src={githubLogo} alt='github logo' />
					<span>Sign in with GitHub</span>
				</button>

				<p className='change-page'>
					Don't have an account? <Link to='/signup'>Sign up</Link>
				</p>

				{error && <div className='error'>{error}</div>}
			</form>
		</div>
	)
}
