import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'

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
		<form className='auth-form' onSubmit={handleSubmit}>
			<h2>Login</h2>

			<label>
				<span>Email:</span>
				<input type='email' required onChange={e => setEmail(e.target.value)} value={email} placeholder='Aa' />
			</label>

			<label>
				<span>Password:</span>
				<input type='password' required onChange={e => setPassword(e.target.value)} value={password} placeholder='Aa' />
			</label>

			{!isPending && <button className='btn'>Login in</button>}
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

			{error && <div className='error'>{error}</div>}
		</form>
	)
}
